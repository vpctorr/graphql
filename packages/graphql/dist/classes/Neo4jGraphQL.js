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
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { composeResolvers } from "@graphql-tools/resolvers-composition";
import { addResolversToSchema, makeExecutableSchema } from "@graphql-tools/schema";
import { forEachField, getResolversFromSchema } from "@graphql-tools/utils";
import Debug from "debug";
import { DEBUG_ALL } from "../constants";
import { makeAugmentedSchema } from "../schema";
import { generateModel } from "../schema-model/generate-model";
import { getDefinitionNodes } from "../schema/get-definition-nodes";
import { makeDocumentToAugment } from "../schema/make-document-to-augment";
import { wrapQueryAndMutation } from "../schema/resolvers/composition/wrap-query-and-mutation";
import { wrapSubscription } from "../schema/resolvers/composition/wrap-subscription";
import { defaultFieldResolver } from "../schema/resolvers/field/defaultField";
import { validateDocument } from "../schema/validation";
import { validateUserDefinition } from "../schema/validation/schema-validation";
import { asArray } from "../utils/utils";
import { Executor } from "./Executor";
import { getNeo4jDatabaseInfo } from "./Neo4jDatabaseInfo";
import { Neo4jGraphQLAuthorization } from "./authorization/Neo4jGraphQLAuthorization";
import { Neo4jGraphQLSubscriptionsDefaultEngine } from "./subscription/Neo4jGraphQLSubscriptionsDefaultEngine";
import { assertIndexesAndConstraints } from "./utils/asserts-indexes-and-constraints";
import { generateResolverComposition } from "./utils/generate-resolvers-composition";
import checkNeo4jCompat from "./utils/verify-database";
class Neo4jGraphQL {
    constructor(input) {
        const { driver, features, typeDefs, resolvers, debug, validate = true } = input;
        this.driver = driver;
        this.features = this.parseNeo4jFeatures(features);
        this.typeDefs = typeDefs;
        this.resolvers = resolvers;
        this.debug = debug;
        this.validate = validate;
        this.checkEnableDebug();
        if (this.features?.authorization) {
            const authorizationSettings = this.features?.authorization;
            this.authorization = new Neo4jGraphQLAuthorization(authorizationSettings);
        }
    }
    async getSchema() {
        return this.getExecutableSchema();
    }
    async getExecutableSchema() {
        if (!this.executableSchema) {
            this.executableSchema = this.generateExecutableSchema();
            await this.subscriptionMechanismSetup();
        }
        return this.executableSchema;
    }
    async getSubgraphSchema() {
        if (!this.subgraphSchema) {
            this.subgraphSchema = this.generateSubgraphSchema();
            await this.subscriptionMechanismSetup();
        }
        return this.subgraphSchema;
    }
    async checkNeo4jCompat({ driver, sessionConfig, } = {}) {
        const neo4jDriver = driver || this.driver;
        if (!neo4jDriver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(neo4jDriver, sessionConfig);
        }
        return checkNeo4jCompat({
            driver: neo4jDriver,
            sessionConfig,
            dbInfo: this.dbInfo,
        });
    }
    async assertIndexesAndConstraints({ driver, sessionConfig, options, } = {}) {
        if (!(this.executableSchema || this.subgraphSchema)) {
            throw new Error("You must await `.getSchema()` before `.assertIndexesAndConstraints()`");
        }
        await (this.executableSchema || this.subgraphSchema);
        const neo4jDriver = driver || this.driver;
        if (!neo4jDriver) {
            throw new Error("neo4j-driver Driver missing");
        }
        if (!this.dbInfo) {
            this.dbInfo = await this.getNeo4jDatabaseInfo(neo4jDriver, sessionConfig);
        }
        if (!this.schemaModel) {
            throw new Error("Schema Model is not defined");
        }
        await assertIndexesAndConstraints({
            driver: neo4jDriver,
            sessionConfig,
            schemaModel: this.schemaModel,
            options: options,
        });
    }
    get nodes() {
        if (!this._nodes) {
            throw new Error("You must await `.getSchema()` before accessing `nodes`");
        }
        return this._nodes;
    }
    get relationships() {
        if (!this._relationships) {
            throw new Error("You must await `.getSchema()` before accessing `relationships`");
        }
        return this._relationships;
    }
    /**
     * Currently just merges all type definitions into a document. Eventual intention described below:
     *
     * Normalizes the user's type definitions using the method with the lowest risk of side effects:
     * - Type definitions of type `string` are parsed using the `parse` function from the reference GraphQL implementation.
     * - Type definitions of type `DocumentNode` are returned as they are.
     * - Type definitions in arrays are merged using `mergeTypeDefs` from `@graphql-tools/merge`.
     * - Callbacks are resolved to a type which can be parsed into a document.
     *
     * This method maps to the Type Definition Normalization stage of the Schema Generation lifecycle.
     *
     * @param {TypeDefinitions} typeDefinitions - The unnormalized type definitions.
     * @returns {DocumentNode} The normalized type definitons as a document.
     */
    normalizeTypeDefinitions(typeDefinitions) {
        // TODO: The dream: minimal modification of the type definitions. However, this does not merge extensions, which we can't currently deal with in translation.
        // if (typeof typeDefinitions === "function") {
        //     return this.normalizeTypeDefinitions(typeDefinitions());
        // }
        // if (typeof typeDefinitions === "string") {
        //     return parse(typeDefinitions);
        // }
        // if (Array.isArray(typeDefinitions)) {
        //     return mergeTypeDefs(typeDefinitions);
        // }
        // return typeDefinitions;
        return mergeTypeDefs(typeDefinitions);
    }
    addDefaultFieldResolvers(schema) {
        forEachField(schema, (field) => {
            if (!field.resolve) {
                field.resolve = defaultFieldResolver;
            }
        });
        return schema;
    }
    checkEnableDebug() {
        if (this.debug === true || this.debug === false) {
            if (this.debug) {
                Debug.enable(DEBUG_ALL);
            }
            else {
                Debug.disable();
            }
        }
    }
    async getNeo4jDatabaseInfo(driver, sessionConfig) {
        const executorConstructorParam = {
            executionContext: driver,
            sessionConfig,
        };
        return getNeo4jDatabaseInfo(new Executor(executorConstructorParam));
    }
    wrapResolvers(resolvers) {
        if (!this.schemaModel) {
            throw new Error("Schema Model is not defined");
        }
        const wrapResolverArgs = {
            driver: this.driver,
            nodes: this.nodes,
            relationships: this.relationships,
            schemaModel: this.schemaModel,
            features: this.features,
            authorization: this.authorization,
            jwtPayloadFieldsMap: this.jwtFieldsMap,
        };
        const queryAndMutationWrappers = [wrapQueryAndMutation(wrapResolverArgs)];
        const isSubscriptionEnabled = !!this.features.subscriptions;
        const wrapSubscriptionResolverArgs = {
            subscriptionsEngine: this.features.subscriptions,
            schemaModel: this.schemaModel,
            authorization: this.authorization,
            jwtPayloadFieldsMap: this.jwtFieldsMap,
        };
        const subscriptionWrappers = isSubscriptionEnabled
            ? [wrapSubscription(wrapSubscriptionResolverArgs)]
            : [];
        const resolversComposition = generateResolverComposition({
            schemaModel: this.schemaModel,
            isSubscriptionEnabled,
            queryAndMutationWrappers,
            subscriptionWrappers,
        });
        // Merge generated and custom resolvers
        // Merging must be done before composing because wrapper won't run otherwise
        const mergedResolvers = mergeResolvers([...asArray(resolvers), ...asArray(this.resolvers)]);
        return composeResolvers(mergedResolvers, resolversComposition);
    }
    composeSchema(schema) {
        // TODO: Keeping this in our back pocket - if we want to add native support for middleware to the library
        // if (this.middlewares) {
        //     schema = applyMiddleware(schema, ...this.middlewares);
        // }
        // Get resolvers from schema - this will include generated _entities and _service for Federation
        const resolvers = getResolversFromSchema(schema);
        // Wrap the resolvers using resolvers composition
        const wrappedResolvers = this.wrapResolvers(resolvers);
        // Add the wrapped resolvers back to the schema, context will now be populated
        addResolversToSchema({ schema, resolvers: wrappedResolvers, updateResolversInPlace: true });
        return this.addDefaultFieldResolvers(schema);
    }
    parseNeo4jFeatures(features) {
        let subscriptionPlugin;
        if (features?.subscriptions === true) {
            subscriptionPlugin = new Neo4jGraphQLSubscriptionsDefaultEngine();
        }
        else {
            subscriptionPlugin = features?.subscriptions || undefined;
        }
        return {
            ...features,
            subscriptions: subscriptionPlugin,
        };
    }
    generateSchemaModel(document) {
        if (!this.schemaModel) {
            return generateModel(document);
        }
        return this.schemaModel;
    }
    generateExecutableSchema() {
        return new Promise((resolve) => {
            const initialDocument = this.normalizeTypeDefinitions(this.typeDefs);
            if (this.validate) {
                const { enumTypes: enums, interfaceTypes: interfaces, unionTypes: unions, objectTypes: objects, } = getDefinitionNodes(initialDocument);
                validateDocument({
                    document: initialDocument,
                    features: this.features,
                    additionalDefinitions: { enums, interfaces, unions, objects },
                    userCustomResolvers: this.resolvers,
                });
            }
            const { document, typesExcludedFromGeneration } = makeDocumentToAugment(initialDocument);
            const { jwt } = typesExcludedFromGeneration;
            if (jwt) {
                this.jwtFieldsMap = jwt.jwtFieldsMap;
            }
            this.schemaModel = this.generateSchemaModel(document);
            const { nodes, relationships, typeDefs, resolvers } = makeAugmentedSchema({
                document,
                features: this.features,
                userCustomResolvers: this.resolvers,
                schemaModel: this.schemaModel,
            });
            if (this.validate) {
                validateUserDefinition({ userDocument: document, augmentedDocument: typeDefs, jwt: jwt?.type });
            }
            this._nodes = nodes;
            this._relationships = relationships;
            const schema = makeExecutableSchema({
                typeDefs,
                resolvers,
            });
            resolve(this.composeSchema(schema));
        });
    }
    async generateSubgraphSchema() {
        // Import only when needed to avoid issues if GraphQL 15 being used
        const { Subgraph } = await import("./Subgraph");
        const initialDocument = this.normalizeTypeDefinitions(this.typeDefs);
        const subgraph = new Subgraph(this.typeDefs);
        const { directives, types } = subgraph.getValidationDefinitions();
        if (this.validate) {
            const { enumTypes: enums, interfaceTypes: interfaces, unionTypes: unions, objectTypes: objects, } = getDefinitionNodes(initialDocument);
            validateDocument({
                document: initialDocument,
                features: this.features,
                additionalDefinitions: {
                    additionalDirectives: directives,
                    additionalTypes: types,
                    enums,
                    interfaces,
                    unions,
                    objects,
                },
                userCustomResolvers: this.resolvers,
            });
        }
        const { document, typesExcludedFromGeneration } = makeDocumentToAugment(initialDocument);
        const { jwt } = typesExcludedFromGeneration;
        if (jwt) {
            this.jwtFieldsMap = jwt.jwtFieldsMap;
        }
        this.schemaModel = this.generateSchemaModel(document);
        const { nodes, relationships, typeDefs, resolvers } = makeAugmentedSchema({
            document,
            features: this.features,
            userCustomResolvers: this.resolvers,
            subgraph,
            schemaModel: this.schemaModel,
        });
        if (this.validate) {
            validateUserDefinition({
                userDocument: document,
                augmentedDocument: typeDefs,
                additionalDirectives: directives,
                additionalTypes: types,
                jwt: jwt?.type,
            });
        }
        this._nodes = nodes;
        this._relationships = relationships;
        // TODO: Move into makeAugmentedSchema, add resolvers alongside other resolvers
        const referenceResolvers = subgraph.getReferenceResolvers(this.schemaModel);
        const schema = subgraph.buildSchema({
            typeDefs,
            resolvers: mergeResolvers([resolvers, referenceResolvers]),
        });
        return this.composeSchema(schema);
    }
    subscriptionMechanismSetup() {
        if (this.subscriptionInit) {
            return this.subscriptionInit;
        }
        const setup = async () => {
            const subscriptionsEngine = this.features?.subscriptions;
            if (subscriptionsEngine) {
                subscriptionsEngine.events.setMaxListeners(0); // Removes warning regarding leak. >10 listeners are expected
                if (subscriptionsEngine.init) {
                    if (!this.schemaModel)
                        throw new Error("SchemaModel not available on subscription mechanism");
                    await subscriptionsEngine.init({ schemaModel: this.schemaModel });
                }
            }
        };
        this.subscriptionInit = setup();
        return this.subscriptionInit;
    }
}
export default Neo4jGraphQL;
