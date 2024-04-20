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
import { mergeDeep } from "@graphql-tools/utils";
import { Integer } from "neo4j-driver";
import { filterTruthy, isRecord } from "../../../utils/utils";
import { assertIsConcreteEntity } from "../utils/is-concrete-entity";
import { isInterfaceEntity } from "../utils/is-interface-entity";
import { isUnionEntity } from "../utils/is-union-entity";
import { AggregateFactory } from "./Operations/AggregateFactory";
import { ConnectionFactory } from "./Operations/ConnectionFactory";
import { CreateFactory } from "./Operations/CreateFactory";
import { CustomCypherFactory } from "./Operations/CustomCypherFactory";
import { DeleteFactory } from "./Operations/DeleteFactory";
import { FulltextFactory } from "./Operations/FulltextFactory";
import { ReadFactory } from "./Operations/ReadFactory";
import { UpdateFactory } from "./Operations/UpdateFactory";
import { parseTopLevelOperationField } from "./parsers/parse-operation-fields";
import { parseSelectionSetField } from "./parsers/parse-selection-set-fields";
export class OperationsFactory {
    constructor(queryASTFactory) {
        this.filterFactory = queryASTFactory.filterFactory;
        this.fieldFactory = queryASTFactory.fieldFactory;
        this.sortAndPaginationFactory = queryASTFactory.sortAndPaginationFactory;
        this.authorizationFactory = queryASTFactory.authorizationFactory;
        this.createFactory = new CreateFactory(queryASTFactory);
        this.updateFactory = new UpdateFactory(queryASTFactory);
        this.deleteFactory = new DeleteFactory(queryASTFactory);
        this.fulltextFactory = new FulltextFactory(queryASTFactory);
        this.aggregateFactory = new AggregateFactory(queryASTFactory);
        this.customCypherFactory = new CustomCypherFactory(queryASTFactory);
        this.connectionFactory = new ConnectionFactory(queryASTFactory);
        this.readFactory = new ReadFactory(queryASTFactory);
    }
    createTopLevelOperation({ entity, resolveTree, context, varName, reference, }) {
        // Handles deprecated top level fulltext
        if (context.resolveTree.args.phrase) {
            if (!context.fulltext) {
                throw new Error("Failed to get context fulltext");
            }
            const indexName = context.fulltext.indexName ?? context.fulltext.name;
            if (indexName === undefined) {
                throw new Error("The name of the fulltext index should be defined using the indexName argument.");
            }
            assertIsConcreteEntity(entity);
            return this.fulltextFactory.createFulltextOperation(entity, resolveTree, context);
        }
        const operationMatch = parseTopLevelOperationField(resolveTree.name, context.schemaModel, entity);
        switch (operationMatch) {
            case "READ": {
                if (context.resolveTree.args.fulltext || context.resolveTree.args.phrase) {
                    assertIsConcreteEntity(entity);
                    return this.fulltextFactory.createFulltextOperation(entity, resolveTree, context);
                }
                if (!entity) {
                    throw new Error("Entity is required for top level read operations");
                }
                return this.readFactory.createReadOperation({
                    entityOrRel: entity,
                    resolveTree,
                    context,
                    varName,
                    reference,
                });
            }
            case "CONNECTION": {
                if (!entity) {
                    throw new Error("Entity is required for top level connection read operations");
                }
                const topLevelConnectionResolveTree = this.connectionFactory.normalizeResolveTreeForTopLevelConnection(resolveTree);
                return this.connectionFactory.createConnectionOperationAST({
                    target: entity,
                    resolveTree: topLevelConnectionResolveTree,
                    context,
                });
            }
            case "AGGREGATE": {
                if (!entity || isUnionEntity(entity)) {
                    throw new Error("Aggregate operations are not supported for Union types");
                }
                return this.aggregateFactory.createAggregationOperation(entity, resolveTree, context);
            }
            case "CREATE": {
                assertIsConcreteEntity(entity);
                return this.createFactory.createCreateOperation(entity, resolveTree, context);
            }
            case "UPDATE": {
                assertIsConcreteEntity(entity);
                return this.updateFactory.createUpdateOperation(entity, resolveTree, context);
            }
            case "DELETE": {
                assertIsConcreteEntity(entity);
                return this.deleteFactory.createTopLevelDeleteOperation({
                    entity,
                    resolveTree,
                    context,
                    varName,
                });
            }
            case "CUSTOM_CYPHER": {
                return this.customCypherFactory.createTopLevelCustomCypherOperation({ entity, resolveTree, context });
            }
        }
    }
    /**
     *  Proxy methods to specialized operations factories.
     *  TODO: Refactor the following to use a generic dispatcher as done in createTopLevelOperation
     **/
    createReadOperation(arg) {
        return this.readFactory.createReadOperation(arg);
    }
    getFulltextSelection(entity, context) {
        return this.fulltextFactory.getFulltextSelection(entity, context);
    }
    createAggregationOperation(entityOrRel, resolveTree, context) {
        return this.aggregateFactory.createAggregationOperation(entityOrRel, resolveTree, context);
    }
    getConnectionOptions(entity, options) {
        return this.connectionFactory.getConnectionOptions(entity, options);
    }
    splitConnectionFields(rawFields) {
        return this.connectionFactory.splitConnectionFields(rawFields);
    }
    createConnectionOperationAST(arg) {
        return this.connectionFactory.createConnectionOperationAST(arg);
    }
    createCompositeConnectionOperationAST(arg) {
        return this.connectionFactory.createCompositeConnectionOperationAST(arg);
    }
    hydrateReadOperation(arg) {
        return this.readFactory.hydrateReadOperation(arg);
    }
    createCustomCypherOperation(arg) {
        return this.customCypherFactory.createCustomCypherOperation(arg);
    }
    /**
     * END of proxy methods
     **/
    hydrateOperation({ entity, operation, whereArgs, context, sortArgs, fieldsByTypeName, partialOf, }) {
        const concreteProjectionFields = { ...fieldsByTypeName[entity.name] };
        // Get the abstract types of the interface
        const entityInterfaces = entity.compositeEntities;
        const interfacesFields = filterTruthy(entityInterfaces.map((i) => fieldsByTypeName[i.name]));
        const projectionFields = mergeDeep([
            ...interfacesFields,
            concreteProjectionFields,
        ]);
        const fields = this.fieldFactory.createFields(entity, projectionFields, context);
        if (partialOf && isInterfaceEntity(partialOf)) {
            const filters = this.filterFactory.createInterfaceNodeFilters({
                entity: partialOf,
                targetEntity: entity,
                whereFields: whereArgs,
            });
            operation.addFilters(...filters);
        }
        else {
            const filters = this.filterFactory.createNodeFilters(entity, whereArgs);
            operation.addFilters(...filters);
        }
        const authFilters = this.authorizationFactory.getAuthFilters({
            entity,
            operations: ["READ"],
            attributes: this.getSelectedAttributes(entity, projectionFields),
            context,
        });
        operation.setFields(fields);
        operation.addAuthFilters(...authFilters);
        if (sortArgs) {
            const sortOptions = this.getOptions(entity, sortArgs);
            if (sortOptions) {
                const sort = this.sortAndPaginationFactory.createSortFields(sortOptions, entity, context);
                operation.addSort(...sort);
                const pagination = this.sortAndPaginationFactory.createPagination(sortOptions);
                if (pagination) {
                    operation.addPagination(pagination);
                }
            }
        }
        return operation;
    }
    getOptions(entity, options) {
        if (!options) {
            return undefined;
        }
        const limitDirective = isUnionEntity(entity) ? undefined : entity.annotations.limit;
        let limit = options?.limit ?? limitDirective?.default ?? limitDirective?.max;
        if (limit instanceof Integer) {
            limit = limit.toNumber();
        }
        const maxLimit = limitDirective?.max;
        if (limit !== undefined && maxLimit !== undefined) {
            limit = Math.min(limit, maxLimit);
        }
        if (limit === undefined && options.offset === undefined && options.sort === undefined)
            return undefined;
        return {
            limit,
            offset: options.offset,
            sort: options.sort,
        };
    }
    getSelectedAttributes(entity, rawFields) {
        return filterTruthy(Object.values(rawFields).map((field) => {
            const { fieldName } = parseSelectionSetField(field.name);
            return entity.findAttribute(fieldName);
        }));
    }
    getWhereArgs(resolveTree, reference) {
        const whereArgs = isRecord(resolveTree.args.where) ? resolveTree.args.where : {};
        if (resolveTree.name === "_entities" && reference) {
            const { __typename, ...referenceWhere } = reference;
            return { ...referenceWhere, ...whereArgs };
        }
        return whereArgs;
    }
}
