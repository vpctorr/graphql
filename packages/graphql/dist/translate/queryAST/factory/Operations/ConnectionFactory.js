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
import { isObject, isString } from "graphql-compose";
import { cursorToOffset } from "graphql-relay";
import { Integer } from "neo4j-driver";
import { InterfaceEntity } from "../../../../schema-model/entity/InterfaceEntity";
import { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { checkEntityAuthentication } from "../../../authorization/check-authentication";
import { ConnectionReadOperation } from "../../ast/operations/ConnectionReadOperation";
import { CompositeConnectionPartial } from "../../ast/operations/composite/CompositeConnectionPartial";
import { CompositeConnectionReadOperation } from "../../ast/operations/composite/CompositeConnectionReadOperation";
import { NodeSelection } from "../../ast/selection/NodeSelection";
import { RelationshipSelection } from "../../ast/selection/RelationshipSelection";
import { getConcreteEntities } from "../../utils/get-concrete-entities";
import { getEntityInterfaces } from "../../utils/get-entity-interfaces";
import { isInterfaceEntity } from "../../utils/is-interface-entity";
import { isRelationshipEntity } from "../../utils/is-relationship-entity";
import { isUnionEntity } from "../../utils/is-union-entity";
import { findFieldsByNameInFieldsByTypeNameField } from "../parsers/find-fields-by-name-in-fields-by-type-name-field";
import { getFieldsByTypeName } from "../parsers/get-fields-by-type-name";
export class ConnectionFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createCompositeConnectionOperationAST({ relationship, target, resolveTree, context, }) {
        const directed = resolveTree.args.directed;
        const resolveTreeWhere = this.queryASTFactory.operationsFactory.getWhereArgs(resolveTree);
        let nodeWhere;
        if (isInterfaceEntity(target)) {
            nodeWhere = isObject(resolveTreeWhere) ? resolveTreeWhere.node : {};
        }
        else {
            nodeWhere = resolveTreeWhere;
        }
        const concreteEntities = getConcreteEntities(target, nodeWhere);
        const concreteConnectionOperations = concreteEntities.map((concreteEntity) => {
            let selection;
            if (relationship) {
                selection = new RelationshipSelection({
                    relationship,
                    directed,
                    targetOverride: concreteEntity,
                });
            }
            else {
                selection = new NodeSelection({
                    target: concreteEntity,
                });
            }
            const connectionPartial = new CompositeConnectionPartial({
                relationship,
                target: concreteEntity,
                selection,
            });
            return this.hydrateConnectionOperationAST({
                relationship,
                target: concreteEntity,
                resolveTree,
                context,
                operation: connectionPartial,
                whereArgs: resolveTreeWhere,
            });
        });
        const compositeConnectionOp = new CompositeConnectionReadOperation(concreteConnectionOperations);
        // These sort fields will be duplicated on nested "CompositeConnectionPartial"
        this.hydrateConnectionOperationsASTWithSort({
            entityOrRel: relationship ?? target,
            resolveTree,
            operation: compositeConnectionOp,
            context,
        });
        return compositeConnectionOp;
    }
    createConnectionOperationAST({ relationship, target, resolveTree, context, }) {
        if (!(target instanceof ConcreteEntityAdapter)) {
            return this.createCompositeConnectionOperationAST({
                relationship,
                target,
                resolveTree,
                context,
            });
        }
        const resolveTreeWhere = this.queryASTFactory.operationsFactory.getWhereArgs(resolveTree);
        checkEntityAuthentication({
            entity: target.entity,
            targetOperations: ["READ"],
            context,
        });
        let selection;
        if (relationship) {
            selection = new RelationshipSelection({
                relationship,
                directed: resolveTree.args.directed,
            });
        }
        else {
            selection = new NodeSelection({
                target,
            });
        }
        const operation = new ConnectionReadOperation({ relationship, target, selection });
        return this.hydrateConnectionOperationAST({
            relationship: relationship,
            target: target,
            resolveTree,
            context,
            operation,
            whereArgs: resolveTreeWhere,
        });
    }
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    hydrateConnectionOperationsASTWithSort({ entityOrRel, resolveTree, operation, context, }) {
        let options;
        const target = isRelationshipEntity(entityOrRel) ? entityOrRel.target : entityOrRel;
        if (!isUnionEntity(target)) {
            options = this.queryASTFactory.operationsFactory.getConnectionOptions(target, resolveTree.args);
        }
        else {
            options = resolveTree.args;
        }
        const first = options?.first;
        const sort = options?.sort;
        const afterArg = options?.after;
        const offset = isString(afterArg) ? cursorToOffset(afterArg) + 1 : undefined;
        if (first || offset) {
            const pagination = this.queryASTFactory.sortAndPaginationFactory.createPagination({
                limit: first,
                offset,
            });
            if (pagination) {
                operation.addPagination(pagination);
            }
        }
        if (sort) {
            sort.forEach((options) => {
                const sort = this.queryASTFactory.sortAndPaginationFactory.createConnectionSortFields(options, entityOrRel, context);
                operation.addSort(sort);
            });
        }
        return operation;
    }
    // The current top-level Connection API is inconsistent with the rest of the API making the parsing more complex than it should be.
    // This function temporary adjust some inconsistencies waiting for the new API.
    // TODO: Remove it when the new API is ready.
    normalizeResolveTreeForTopLevelConnection(resolveTree) {
        const topLevelConnectionResolveTree = Object.assign({}, resolveTree);
        // Move the sort arguments inside a "node" object.
        if (topLevelConnectionResolveTree.args.sort) {
            topLevelConnectionResolveTree.args.sort = resolveTree.args.sort.map((sortField) => {
                return { node: sortField };
            });
        }
        // move the where arguments inside a "node" object.
        if (topLevelConnectionResolveTree.args.where) {
            topLevelConnectionResolveTree.args.where = { node: resolveTree.args.where };
        }
        return topLevelConnectionResolveTree;
    }
    splitConnectionFields(rawFields) {
        let nodeField;
        let edgeField;
        const fields = {};
        Object.entries(rawFields).forEach(([key, field]) => {
            if (field.name === "node") {
                nodeField = field;
            }
            else if (field.name === "edge") {
                edgeField = field;
            }
            else {
                fields[key] = field;
            }
        });
        return {
            node: nodeField,
            edge: edgeField,
            fields,
        };
    }
    getConnectionOptions(entity, options) {
        const limitDirective = entity.annotations.limit;
        let limit = options?.first ?? limitDirective?.default ?? limitDirective?.max;
        if (limit instanceof Integer) {
            limit = limit.toNumber();
        }
        const maxLimit = limitDirective?.max;
        if (limit !== undefined && maxLimit !== undefined) {
            limit = Math.min(limit, maxLimit);
        }
        if (limit === undefined && options.after === undefined && options.sort === undefined)
            return undefined;
        return {
            first: limit,
            after: options.after,
            sort: options.sort,
        };
    }
    hydrateConnectionOperationAST({ relationship, target, resolveTree, context, operation, whereArgs, }) {
        const entityOrRel = relationship ?? target;
        const resolveTreeEdgeFields = this.parseConnectionFields({
            entityOrRel,
            target,
            resolveTree,
        });
        const nodeFieldsRaw = findFieldsByNameInFieldsByTypeNameField(resolveTreeEdgeFields, "node");
        const propertiesFieldsRaw = findFieldsByNameInFieldsByTypeNameField(resolveTreeEdgeFields, "properties");
        this.hydrateConnectionOperationsASTWithSort({
            entityOrRel,
            resolveTree,
            operation,
            context,
        });
        const isTopLevel = !relationship;
        const resolveTreeNodeFieldsTypesNames = [
            target.name,
            ...target.compositeEntities.filter((e) => e instanceof InterfaceEntity).map((e) => e.name),
        ];
        if (!isTopLevel) {
            resolveTreeNodeFieldsTypesNames.push(relationship.target.name);
        }
        const resolveTreeNodeFields = getFieldsByTypeName(nodeFieldsRaw, resolveTreeNodeFieldsTypesNames);
        const nodeFields = this.queryASTFactory.fieldFactory.createFields(target, resolveTreeNodeFields, context);
        let edgeFields = [];
        if (!isTopLevel && relationship.propertiesTypeName) {
            const resolveTreePropertiesFields = getFieldsByTypeName(propertiesFieldsRaw, [
                relationship.propertiesTypeName,
            ]);
            edgeFields = this.queryASTFactory.fieldFactory.createFields(relationship, resolveTreePropertiesFields, context);
        }
        const authFilters = this.queryASTFactory.authorizationFactory.getAuthFilters({
            entity: target,
            operations: ["READ"],
            attributes: this.queryASTFactory.operationsFactory.getSelectedAttributes(target, resolveTreeNodeFields),
            context,
        });
        const filters = this.queryASTFactory.filterFactory.createConnectionPredicates({
            rel: relationship,
            entity: target,
            where: whereArgs,
        });
        operation.setNodeFields(nodeFields);
        operation.setEdgeFields(edgeFields);
        operation.addFilters(...filters);
        operation.addAuthFilters(...authFilters);
        return operation;
    }
    parseConnectionFields({ target, resolveTree, entityOrRel, }) {
        // Get interfaces of the entity
        const entityInterfaces = getEntityInterfaces(target);
        const interfacesFields = entityInterfaces.map((interfaceAdapter) => {
            return resolveTree.fieldsByTypeName[interfaceAdapter.operations.connectionFieldTypename] ?? {};
        });
        const concreteProjectionFields = {
            ...resolveTree.fieldsByTypeName[entityOrRel.operations.connectionFieldTypename],
        };
        const resolveTreeConnectionFields = mergeDeep([
            ...interfacesFields,
            concreteProjectionFields,
        ]);
        const edgeFieldsRaw = findFieldsByNameInFieldsByTypeNameField(resolveTreeConnectionFields, "edges");
        const interfacesEdgeFields = entityInterfaces.map((interfaceAdapter) => {
            return getFieldsByTypeName(edgeFieldsRaw, `${interfaceAdapter.name}Edge`);
        });
        const concreteEdgeFields = getFieldsByTypeName(edgeFieldsRaw, entityOrRel.operations.relationshipFieldTypename);
        return mergeDeep([...interfacesEdgeFields, concreteEdgeFields]);
    }
}
