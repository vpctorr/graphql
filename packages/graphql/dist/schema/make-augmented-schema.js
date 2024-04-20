/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString, Kind, parse, print } from "graphql";
import { SchemaComposer } from "graphql-compose";
import * as Scalars from "../graphql/scalars";
import { AggregationTypesMapper } from "./aggregations/aggregation-types-mapper";
import { augmentFulltextSchema } from "./augment/fulltext";
import { ensureNonEmptyInput } from "./ensure-non-empty-input";
import getCustomResolvers from "./get-custom-resolvers";
import { getDefinitionNodes } from "./get-definition-nodes";
import getObjFieldMeta from "./get-obj-field-meta";
import { cypherResolver } from "./resolvers/field/cypher";
import { createResolver } from "./resolvers/mutation/create";
import { deleteResolver } from "./resolvers/mutation/delete";
import { updateResolver } from "./resolvers/mutation/update";
import { aggregateResolver } from "./resolvers/query/aggregate";
import { findResolver } from "./resolvers/query/read";
import { rootConnectionResolver } from "./resolvers/query/root-connection";
import { attributeAdapterToComposeFields, graphqlDirectivesToCompose } from "./to-compose";
import { Neo4jGraphQLSubscriptionsCDCEngine } from "../classes/subscription/Neo4jGraphQLSubscriptionsCDCEngine";
import { SHAREABLE } from "../constants";
import { CreateInfo } from "../graphql/objects/CreateInfo";
import { DeleteInfo } from "../graphql/objects/DeleteInfo";
import { PageInfo } from "../graphql/objects/PageInfo";
import { UpdateInfo } from "../graphql/objects/UpdateInfo";
import { OperationAdapter } from "../schema-model/OperationAdapter";
import { ConcreteEntity } from "../schema-model/entity/ConcreteEntity";
import { InterfaceEntity } from "../schema-model/entity/InterfaceEntity";
import { UnionEntity } from "../schema-model/entity/UnionEntity";
import { ConcreteEntityAdapter } from "../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../schema-model/entity/model-adapters/UnionEntityAdapter";
import { RelationshipDeclarationAdapter } from "../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import { filterTruthy } from "../utils/utils";
import { createConnectionFields } from "./create-connection-fields";
import { addGlobalNodeFields } from "./create-global-nodes";
import { createRelationshipFields } from "./create-relationship-fields/create-relationship-fields";
import { deprecationMap } from "./deprecation-map";
import { AugmentedSchemaGenerator } from "./generation/AugmentedSchemaGenerator";
import { withAggregateSelectionType } from "./generation/aggregate-types";
import { withCreateInputType } from "./generation/create-input";
import { withInterfaceType } from "./generation/interface-type";
import { withObjectType } from "./generation/object-type";
import { withMutationResponseTypes } from "./generation/response-types";
import { withOptionsInputType } from "./generation/sort-and-options-input";
import { withUpdateInputType } from "./generation/update-input";
import { withUniqueWhereInputType, withWhereInputType } from "./generation/where-input";
import getNodes from "./get-nodes";
import { getResolveAndSubscriptionMethods } from "./get-resolve-and-subscription-methods";
import { filterInterfaceTypes } from "./make-augmented-schema/filter-interface-types";
import { getUserDefinedDirectives } from "./make-augmented-schema/user-defined-directives";
import { generateSubscriptionTypes } from "./subscriptions/generate-subscription-types";
function definitionNodeHasName(x) {
    return "name" in x;
}
function makeAugmentedSchema({ document, features, userCustomResolvers, subgraph, schemaModel, }) {
    const composer = new SchemaComposer();
    const callbacks = features?.populatedBy?.callbacks;
    let relationships = [];
    const definitionNodes = getDefinitionNodes(document);
    const customResolvers = getCustomResolvers(document);
    const { interfaceTypes, scalarTypes, objectTypes, enumTypes, unionTypes, schemaExtensions } = definitionNodes;
    // TODO: maybe use schemaModel.definitionCollection instead of definitionNodes? need to add inputObjectTypes and customResolvers
    const schemaGenerator = new AugmentedSchemaGenerator(schemaModel, definitionNodes, [customResolvers.customQuery, customResolvers.customMutation, customResolvers.customSubscription].filter((x) => Boolean(x)));
    const generatorComposer = schemaGenerator.generate();
    composer.merge(generatorComposer);
    // TODO: move these to SchemaGenerator once the other types are moved (in the meantime references to object types are causing errors because they are not present in the generated schema)
    const pipedDefs = [
        ...definitionNodes.enumTypes,
        ...definitionNodes.scalarTypes,
        ...definitionNodes.inputObjectTypes,
        ...definitionNodes.unionTypes,
        ...definitionNodes.directives,
        ...filterTruthy([
            customResolvers.customQuery,
            customResolvers.customMutation,
            customResolvers.customSubscription,
        ]),
    ];
    if (pipedDefs.length) {
        composer.addTypeDefs(print({ kind: Kind.DOCUMENT, definitions: pipedDefs }));
    }
    // Loop over all entries in the deprecation map and add field deprecations to all types in the map.
    for (const [typeName, deprecatedFields] of deprecationMap) {
        const typeComposer = composer.getOTC(typeName);
        typeComposer.deprecateFields(deprecatedFields.reduce((acc, { field, reason }) => ({ ...acc, [field]: reason }), {}));
    }
    // TODO: ideally move these in getSubgraphSchema()
    if (subgraph) {
        const shareable = subgraph.getFullyQualifiedDirectiveName(SHAREABLE);
        [CreateInfo.name, UpdateInfo.name, DeleteInfo.name, PageInfo.name].forEach((typeName) => {
            const typeComposer = composer.getOTC(typeName);
            typeComposer.setDirectiveByName(shareable);
        });
    }
    const aggregationTypesMapper = new AggregationTypesMapper(composer, subgraph);
    const getNodesResult = getNodes(definitionNodes, { callbacks, userCustomResolvers });
    const { nodes, relationshipPropertyInterfaceNames, interfaceRelationshipNames } = getNodesResult;
    const hasGlobalNodes = addGlobalNodeFields(nodes, composer, schemaModel.concreteEntities);
    const { filteredInterfaceTypes } = filterInterfaceTypes(interfaceTypes, interfaceRelationshipNames);
    const relationshipProperties = objectTypes.filter((objectType) => {
        return relationshipPropertyInterfaceNames.has(objectType.name.value);
    });
    const { userDefinedFieldDirectivesForNode, userDefinedDirectivesForNode, propagatedDirectivesForNode, userDefinedDirectivesForInterface, userDefinedDirectivesForUnion, } = getUserDefinedDirectives(definitionNodes);
    /**
     * TODO [translation-layer-compatibility]
     * keeping this `relationshipFields` scaffold for backwards compatibility on translation layer
     * actual functional logic is in schemaModel.concreteEntities.forEach
     */
    const relationshipFields = new Map();
    relationshipProperties.forEach((relationship) => {
        const relFields = getObjFieldMeta({
            enums: enumTypes,
            interfaces: filteredInterfaceTypes,
            objects: objectTypes,
            scalars: scalarTypes,
            unions: unionTypes,
            obj: relationship,
            callbacks,
        });
        relationshipFields.set(relationship.name.value, relFields);
    });
    // this is the new "functional" way for the above forEach
    // helper to only create relationshipProperties Interface types once, even if multiple relationships reference it
    const seenRelationshipPropertiesTypes = new Set();
    schemaModel.entities.forEach((entity) => {
        if (entity instanceof UnionEntity) {
            const unionEntityAdapter = new UnionEntityAdapter(entity);
            withWhereInputType({
                entityAdapter: unionEntityAdapter,
                userDefinedFieldDirectives: new Map(),
                features,
                composer,
            });
            // strip-out the schema config directives from the union type
            const def = composer.getUTC(unionEntityAdapter.name);
            def.setDirectives(graphqlDirectivesToCompose(userDefinedDirectivesForUnion.get(unionEntityAdapter.name) || []));
            if (unionEntityAdapter.isReadable) {
                composer.Query.addFields({
                    [unionEntityAdapter.operations.rootTypeFieldNames.read]: findResolver({
                        entityAdapter: unionEntityAdapter,
                    }),
                });
            }
            return;
        }
        if (entity instanceof InterfaceEntity) {
            const interfaceEntityAdapter = new InterfaceEntityAdapter(entity);
            const userDefinedInterfaceDirectives = userDefinedDirectivesForInterface.get(entity.name) || [];
            generateInterfaceObjectType({
                composer,
                interfaceEntityAdapter,
                subgraph,
                userDefinedInterfaceDirectives,
                userDefinedFieldDirectivesForNode,
                propagatedDirectivesForNode,
                aggregationTypesMapper,
                seenRelationshipPropertiesTypes,
            });
            const connectionFields = createConnectionFields({
                entityAdapter: interfaceEntityAdapter,
                relationshipFields,
            });
            relationships = [...relationships, ...connectionFields];
            return;
        }
        if (entity instanceof ConcreteEntity) {
            /**
             * TODO [translation-layer-compatibility]
             * need the node for fulltext translation
             */
            const node = nodes.find((n) => n.name === entity.name);
            if (!node) {
                throw new Error(`Node not found with the name ${entity.name}`);
            }
            const concreteEntityAdapter = new ConcreteEntityAdapter(entity);
            const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(concreteEntityAdapter.name);
            if (!userDefinedFieldDirectives) {
                throw new Error(`User defined field directives not found for ${concreteEntityAdapter.name}`);
            }
            const propagatedDirectives = propagatedDirectivesForNode.get(entity.name) || [];
            const userDefinedObjectDirectives = (userDefinedDirectivesForNode.get(entity.name) || []).concat(propagatedDirectives);
            generateObjectType({
                composer,
                concreteEntityAdapter,
                subgraph,
                features,
                userDefinedObjectDirectives,
                userDefinedFieldDirectives,
                propagatedDirectives,
                aggregationTypesMapper,
                node,
                seenRelationshipPropertiesTypes,
                userDefinedDirectivesForNode,
                userDefinedFieldDirectivesForNode,
            });
            const connectionFields = createConnectionFields({
                entityAdapter: concreteEntityAdapter,
                relationshipFields,
            });
            relationships = [...relationships, ...connectionFields];
            return;
        }
    });
    if (features?.subscriptions && nodes.length) {
        const isCDCEngine = features.subscriptions instanceof Neo4jGraphQLSubscriptionsCDCEngine;
        generateSubscriptionTypes({
            schemaComposer: composer,
            schemaModel,
            userDefinedFieldDirectivesForNode,
            generateRelationshipTypes: !isCDCEngine,
            features,
        });
    }
    ["Query", "Mutation"].forEach((type) => {
        const objectComposer = composer[type];
        const operation = schemaModel.operations[type];
        if (!operation) {
            return;
        }
        const operationAdapter = new OperationAdapter(operation);
        const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(type);
        for (const attributeAdapter of operationAdapter.attributes.values()) {
            /**
             * TODO [translation-layer-compatibility]
             * needed for compatibility with translation layer
             */
            const objectFields = getObjFieldMeta({
                obj: customResolvers[`customCypher${type}`],
                scalars: scalarTypes,
                enums: enumTypes,
                interfaces: filteredInterfaceTypes,
                unions: unionTypes,
                objects: objectTypes,
                callbacks,
            });
            const field = objectFields.cypherFields.find((f) => f.fieldName === attributeAdapter.name);
            const customResolver = cypherResolver({
                field,
                attributeAdapter,
                type: type,
            });
            const composedField = attributeAdapterToComposeFields([attributeAdapter], userDefinedFieldDirectives)[attributeAdapter.name];
            objectComposer.addFields({ [attributeAdapter.name]: { ...composedField, ...customResolver } });
        }
        // this is to remove library directives from custom resolvers on root type fields in augmented schema
        for (const attributeAdapter of operationAdapter.userResolvedAttributes.values()) {
            const composedField = attributeAdapterToComposeFields([attributeAdapter], userDefinedFieldDirectives)[attributeAdapter.name];
            if (composedField) {
                objectComposer.addFields({ [attributeAdapter.name]: composedField });
            }
        }
    });
    if (!Object.values(composer.Mutation.getFields()).length) {
        composer.delete("Mutation");
    }
    if (!Object.values(composer.Subscription.getFields()).length) {
        composer.delete("Subscription");
    }
    const generatedTypeDefs = composer.toSDL();
    let parsedDoc = parse(generatedTypeDefs);
    const documentNames = new Set(parsedDoc.definitions.filter(definitionNodeHasName).map((x) => x.name.value));
    const resolveMethods = getResolveAndSubscriptionMethods(composer);
    const generatedResolveMethods = {};
    for (const [key, value] of Object.entries(resolveMethods)) {
        if (documentNames.has(key)) {
            generatedResolveMethods[key] = value;
        }
    }
    const generatedResolvers = {
        ...generatedResolveMethods,
        ...Object.values(Scalars).reduce((res, scalar) => {
            if (generatedTypeDefs.includes(`scalar ${scalar.name}\n`)) {
                res[scalar.name] = scalar;
            }
            return res;
        }, {}),
        ...(hasGlobalNodes ? { Node: { __resolveType: (root) => root.__resolveType } } : {}),
    };
    // TODO: improve this logic so we don't iterate through the entire document for each compositeEntity
    // It is possible to make types "writeonly". In this case adding a resolver for them breaks schema generation.
    schemaModel.compositeEntities.forEach((compositeEntity) => {
        const definitionIsOfTheSameType = (def) => (def.kind === Kind.UNION_TYPE_DEFINITION && compositeEntity instanceof UnionEntity) ||
            (def.kind === Kind.INTERFACE_TYPE_DEFINITION && compositeEntity instanceof InterfaceEntity);
        const shouldGenerateResolver = parsedDoc.definitions.some((def) => {
            if (definitionIsOfTheSameType(def) && def.name.value === compositeEntity.name) {
                return true;
            }
            return false;
        });
        if (shouldGenerateResolver && !generatedResolvers[compositeEntity.name]) {
            generatedResolvers[compositeEntity.name] = {
                __resolveType: (root) => root.__resolveType,
            };
        }
        if (compositeEntity instanceof InterfaceEntity) {
            for (const relationshipDeclaration of compositeEntity.relationshipDeclarations.values()) {
                const relationshipDeclarationPropertiesType = new RelationshipDeclarationAdapter(relationshipDeclaration).operations.relationshipPropertiesFieldTypename;
                const isPropertiesTypeInSchema = parsedDoc.definitions.some((def) => def["name"]?.value === relationshipDeclarationPropertiesType);
                if (isPropertiesTypeInSchema && !generatedResolvers[relationshipDeclarationPropertiesType]) {
                    generatedResolvers[relationshipDeclarationPropertiesType] = {
                        __resolveType: (root) => root.__resolveType,
                    };
                }
            }
        }
    });
    // do not propagate Neo4jGraphQL directives on schema extensions
    const schemaExtensionsWithoutNeo4jDirectives = schemaExtensions.map((schemaExtension) => {
        return {
            kind: schemaExtension.kind,
            loc: schemaExtension.loc,
            operationTypes: schemaExtension.operationTypes,
            directives: schemaExtension.directives?.filter((schemaDirective) => !["query", "mutation", "subscription", "authentication"].includes(schemaDirective.name.value)),
        };
    });
    const seen = {};
    parsedDoc = {
        ...parsedDoc,
        definitions: [
            ...parsedDoc.definitions.filter((definition) => {
                // Filter out default scalars, they are not needed and can cause issues
                if (definition.kind === Kind.SCALAR_TYPE_DEFINITION) {
                    if ([
                        GraphQLBoolean.name,
                        GraphQLFloat.name,
                        GraphQLID.name,
                        GraphQLInt.name,
                        GraphQLString.name,
                    ].includes(definition.name.value)) {
                        return false;
                    }
                }
                if (!("name" in definition)) {
                    return true;
                }
                const n = definition.name?.value;
                if (seen[n]) {
                    return false;
                }
                seen[n] = n;
                return true;
            }),
            ...schemaExtensionsWithoutNeo4jDirectives,
        ],
    };
    return {
        nodes,
        relationships,
        typeDefs: parsedDoc,
        resolvers: generatedResolvers,
    };
}
export default makeAugmentedSchema;
// TODO: unify object & interface fns
function generateObjectType({ composer, concreteEntityAdapter, features, subgraph, userDefinedFieldDirectives, userDefinedObjectDirectives, propagatedDirectives, aggregationTypesMapper, node, seenRelationshipPropertiesTypes, userDefinedDirectivesForNode, userDefinedFieldDirectivesForNode, }) {
    withOptionsInputType({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
    withWhereInputType({
        entityAdapter: concreteEntityAdapter,
        userDefinedFieldDirectives,
        features,
        composer,
    });
    /**
     * TODO [translation-layer-compatibility]
     * Need to migrate resolvers, which themselves rely on the translation layer being migrated to the new schema model
     */
    augmentFulltextSchema(node, composer, concreteEntityAdapter);
    withUniqueWhereInputType({ concreteEntityAdapter, composer });
    withCreateInputType({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
    withUpdateInputType({ entityAdapter: concreteEntityAdapter, userDefinedFieldDirectives, composer });
    withMutationResponseTypes({ concreteEntityAdapter, propagatedDirectives, composer });
    const composeNode = withObjectType({
        entityAdapter: concreteEntityAdapter,
        userDefinedFieldDirectives,
        userDefinedObjectDirectives,
        composer,
    });
    createRelationshipFields({
        entityAdapter: concreteEntityAdapter,
        schemaComposer: composer,
        composeNode,
        subgraph,
        userDefinedFieldDirectives,
        userDefinedDirectivesForNode,
        userDefinedFieldDirectivesForNode,
        features,
        seenRelationshipPropertiesTypes,
    });
    ensureNonEmptyInput(composer, concreteEntityAdapter.operations.updateInputTypeName);
    ensureNonEmptyInput(composer, concreteEntityAdapter.operations.createInputTypeName);
    if (concreteEntityAdapter.isReadable) {
        composer.Query.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.read]: findResolver({
                entityAdapter: concreteEntityAdapter,
            }),
        });
        composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.read, graphqlDirectivesToCompose(propagatedDirectives));
        composer.Query.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.connection]: rootConnectionResolver({
                composer,
                entityAdapter: concreteEntityAdapter,
                propagatedDirectives,
            }),
        });
        composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.connection, graphqlDirectivesToCompose(propagatedDirectives));
    }
    if (concreteEntityAdapter.isAggregable) {
        withAggregateSelectionType({
            entityAdapter: concreteEntityAdapter,
            aggregationTypesMapper,
            propagatedDirectives,
            composer,
        });
        composer.Query.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.aggregate]: aggregateResolver({
                entityAdapter: concreteEntityAdapter,
            }),
        });
        composer.Query.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.aggregate, graphqlDirectivesToCompose(propagatedDirectives));
    }
    if (concreteEntityAdapter.isCreatable) {
        composer.Mutation.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.create]: createResolver({
                node,
                concreteEntityAdapter,
            }),
        });
        composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.create, graphqlDirectivesToCompose(propagatedDirectives));
    }
    if (concreteEntityAdapter.isDeletable) {
        composer.Mutation.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.delete]: deleteResolver({
                node,
                composer,
                concreteEntityAdapter,
            }),
        });
        composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.delete, graphqlDirectivesToCompose(propagatedDirectives));
    }
    if (concreteEntityAdapter.isUpdatable) {
        composer.Mutation.addFields({
            [concreteEntityAdapter.operations.rootTypeFieldNames.update]: updateResolver({
                node,
                composer,
                concreteEntityAdapter,
            }),
        });
        composer.Mutation.setFieldDirectives(concreteEntityAdapter.operations.rootTypeFieldNames.update, graphqlDirectivesToCompose(propagatedDirectives));
    }
}
function generateInterfaceObjectType({ composer, interfaceEntityAdapter, features, subgraph, userDefinedFieldDirectivesForNode, userDefinedInterfaceDirectives, propagatedDirectivesForNode, aggregationTypesMapper, seenRelationshipPropertiesTypes, }) {
    const userDefinedFieldDirectives = userDefinedFieldDirectivesForNode.get(interfaceEntityAdapter.name);
    withOptionsInputType({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    withWhereInputType({
        entityAdapter: interfaceEntityAdapter,
        userDefinedFieldDirectives,
        features,
        composer,
    });
    withCreateInputType({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    withUpdateInputType({ entityAdapter: interfaceEntityAdapter, userDefinedFieldDirectives, composer });
    const composeInterface = withInterfaceType({
        interfaceEntityAdapter,
        userDefinedFieldDirectives,
        userDefinedInterfaceDirectives,
        composer,
    });
    createRelationshipFields({
        entityAdapter: interfaceEntityAdapter,
        schemaComposer: composer,
        composeNode: composeInterface,
        subgraph,
        userDefinedFieldDirectives,
        userDefinedDirectivesForNode: new Map(),
        userDefinedFieldDirectivesForNode,
        features,
        seenRelationshipPropertiesTypes,
    });
    const propagatedDirectives = propagatedDirectivesForNode.get(interfaceEntityAdapter.name) || [];
    if (interfaceEntityAdapter.isReadable) {
        composer.Query.addFields({
            [interfaceEntityAdapter.operations.rootTypeFieldNames.read]: findResolver({
                entityAdapter: interfaceEntityAdapter,
            }),
        });
        composer.Query.setFieldDirectives(interfaceEntityAdapter.operations.rootTypeFieldNames.read, graphqlDirectivesToCompose(propagatedDirectives));
        composer.Query.addFields({
            [interfaceEntityAdapter.operations.rootTypeFieldNames.connection]: rootConnectionResolver({
                composer,
                entityAdapter: interfaceEntityAdapter,
                propagatedDirectives,
            }),
        });
        composer.Query.setFieldDirectives(interfaceEntityAdapter.operations.rootTypeFieldNames.connection, graphqlDirectivesToCompose(propagatedDirectives));
    }
    if (interfaceEntityAdapter.isAggregable) {
        withAggregateSelectionType({
            entityAdapter: interfaceEntityAdapter,
            aggregationTypesMapper,
            propagatedDirectives,
            composer,
        });
        composer.Query.addFields({
            [interfaceEntityAdapter.operations.rootTypeFieldNames.aggregate]: aggregateResolver({
                entityAdapter: interfaceEntityAdapter,
            }),
        });
        composer.Query.setFieldDirectives(interfaceEntityAdapter.operations.rootTypeFieldNames.aggregate, graphqlDirectivesToCompose(propagatedDirectives));
    }
}
