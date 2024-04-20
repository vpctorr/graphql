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
import { getEntityAdapter } from "../../../schema-model/utils/get-entity-adapter";
import { filterTruthy } from "../../../utils/utils";
import { checkEntityAuthentication } from "../../authorization/check-authentication";
import { OperationField } from "../ast/fields/OperationField";
import { AggregationAttributeField } from "../ast/fields/aggregation-fields/AggregationAttributeField";
import { CountField } from "../ast/fields/aggregation-fields/CountField";
import { AttributeField } from "../ast/fields/attribute-fields/AttributeField";
import { DateTimeField } from "../ast/fields/attribute-fields/DateTimeField";
import { PointAttributeField } from "../ast/fields/attribute-fields/PointAttributeField";
import { isConcreteEntity } from "../utils/is-concrete-entity";
import { parseSelectionSetField } from "./parsers/parse-selection-set-fields";
export class FieldFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createFields(entity, rawFields, context) {
        const fieldsToMerge = filterTruthy(Object.values(rawFields).map((field) => {
            const { fieldName } = parseSelectionSetField(field.name);
            return this.getRequiredResolveTree({
                entity,
                fieldName,
            });
        }));
        const mergedFields = mergeDeep([rawFields, ...fieldsToMerge]);
        const fields = Object.values(mergedFields).flatMap((field) => {
            const { fieldName, isConnection, isAggregation } = parseSelectionSetField(field.name);
            if (isConcreteEntity(entity)) {
                // TODO: Move this to the tree
                checkEntityAuthentication({
                    entity: entity.entity,
                    targetOperations: ["READ"],
                    context,
                    field: field.name,
                });
                const relationship = entity.findRelationship(fieldName);
                if (relationship) {
                    if (isConnection) {
                        return this.createConnectionField(relationship, field, context);
                    }
                    if (isAggregation) {
                        return this.createRelationshipAggregationField(relationship, field, context);
                    }
                    return this.createRelationshipField({ relationship, field, context });
                }
                if (!relationship && (isConnection || isAggregation)) {
                    throw new Error(`Relationship ${fieldName} not found in entity ${entity.name}`);
                }
            }
            return this.createAttributeField({
                entity,
                fieldName,
                field,
                context,
            });
        });
        return filterTruthy(fields);
    }
    createRelationshipAggregationField(relationship, resolveTree, context) {
        const operation = this.queryASTFactory.operationsFactory.createAggregationOperation(relationship, resolveTree, context);
        return new OperationField({
            alias: resolveTree.alias,
            operation,
        });
    }
    createAggregationFields(entity, rawFields) {
        return filterTruthy(Object.values(rawFields).map((field) => {
            if (field.name === "count") {
                return new CountField({
                    alias: field.alias,
                    entity: entity,
                });
            }
            else {
                const attribute = entity.findAttribute(field.name);
                if (!attribute) {
                    throw new Error(`Attribute ${field.name} not found`);
                }
                const aggregateFields = field.fieldsByTypeName[attribute.getAggregateSelectionTypeName()] || {};
                const aggregationProjection = Object.values(aggregateFields).reduce((acc, f) => {
                    acc[f.name] = f.alias;
                    return acc;
                }, {});
                return new AggregationAttributeField({
                    attribute,
                    alias: field.alias,
                    aggregationProjection,
                });
            }
        }));
    }
    getRequiredResolveTree({ entity, fieldName, }) {
        const attribute = entity.findAttribute(fieldName);
        if (!attribute) {
            return;
        }
        const customResolver = attribute.annotations.customResolver;
        if (!customResolver) {
            return;
        }
        return customResolver.parsedRequires;
    }
    createAttributeField({ entity, fieldName, field, context, }) {
        if (["cursor", "node"].includes(fieldName)) {
            return;
        }
        const attribute = entity.findAttribute(fieldName);
        if (fieldName === "id" && !attribute && isConcreteEntity(entity)) {
            const globalIdAttribute = entity.globalIdField;
            if (!globalIdAttribute) {
                throw new Error(`attribute ${fieldName} not found`);
            }
            return new AttributeField({ alias: globalIdAttribute.name, attribute: globalIdAttribute });
        }
        if (!attribute) {
            throw new Error(`attribute ${fieldName} not found`);
        }
        const cypherAnnotation = attribute.annotations.cypher;
        if (cypherAnnotation) {
            return this.createCypherAttributeField({
                field,
                attribute,
                context,
                cypherAnnotation,
            });
        }
        if (attribute.typeHelper.isPoint() || attribute.typeHelper.isCartesianPoint()) {
            const typeName = attribute.typeHelper.isList()
                ? attribute.type.ofType.name
                : attribute.type.name;
            const { crs } = field.fieldsByTypeName[typeName];
            return new PointAttributeField({
                attribute,
                alias: field.alias,
                crs: Boolean(crs),
            });
        }
        if (attribute.typeHelper.isDateTime()) {
            return new DateTimeField({
                attribute,
                alias: field.alias,
            });
        }
        return new AttributeField({ alias: field.alias, attribute });
    }
    createCypherAttributeField({ field, attribute, context, cypherAnnotation, }) {
        const typeName = attribute.typeHelper.isList() ? attribute.type.ofType.name : attribute.type.name;
        const rawFields = field.fieldsByTypeName[typeName];
        const extraParams = {};
        if (cypherAnnotation.statement.includes("$jwt") && context.authorization.jwtParam) {
            extraParams.jwt = context.authorization.jwtParam.value;
        }
        // move the user specified arguments in a different object as they should be treated as arguments of a Cypher Field
        const cypherArguments = { ...field.args };
        field.args = {};
        if (rawFields) {
            if (attribute.typeHelper.isObject()) {
                const concreteEntity = this.queryASTFactory.schemaModel.getConcreteEntityAdapter(typeName);
                if (!concreteEntity) {
                    throw new Error(`Entity ${typeName} not found`);
                }
                return this.createCypherOperationField({
                    target: concreteEntity,
                    field,
                    context,
                    cypherAttributeField: attribute,
                    cypherArguments,
                });
            }
            else if (attribute.typeHelper.isAbstract()) {
                const entity = this.queryASTFactory.schemaModel.getEntity(typeName);
                // Raise an error as we expect that any complex attributes type are always entities
                if (!entity) {
                    throw new Error(`Entity ${typeName} not found`);
                }
                if (!entity.isCompositeEntity()) {
                    throw new Error(`Entity ${typeName} is not a composite entity`);
                }
                const targetEntity = getEntityAdapter(entity);
                return this.createCypherOperationField({
                    target: targetEntity,
                    field,
                    context,
                    cypherAttributeField: attribute,
                    cypherArguments,
                });
            }
        }
        return this.createCypherOperationField({
            field,
            context,
            cypherAttributeField: attribute,
            cypherArguments,
        });
    }
    createConnectionOperation(relationship, target, resolveTree, context) {
        if (isConcreteEntity(target)) {
            return this.queryASTFactory.operationsFactory.createConnectionOperationAST({
                relationship,
                target,
                resolveTree,
                context,
            });
        }
        return this.queryASTFactory.operationsFactory.createCompositeConnectionOperationAST({
            relationship,
            target,
            resolveTree,
            context,
        });
    }
    createConnectionField(relationship, field, context) {
        const connectionOp = this.createConnectionOperation(relationship, relationship.target, field, context);
        return new OperationField({
            operation: connectionOp,
            alias: field.alias,
        });
    }
    createCypherOperationField({ target, field, context, cypherAttributeField, cypherArguments, }) {
        const cypherOp = this.queryASTFactory.operationsFactory.createCustomCypherOperation({
            resolveTree: field,
            context,
            entity: target,
            cypherAttributeField,
            cypherArguments,
        });
        return new OperationField({
            operation: cypherOp,
            alias: field.alias,
        });
    }
    createRelationshipField({ relationship, field, context, }) {
        const operation = this.queryASTFactory.operationsFactory.createReadOperation({
            entityOrRel: relationship,
            resolveTree: field,
            context,
        });
        return new OperationField({
            operation,
            alias: field.alias,
        });
    }
}
