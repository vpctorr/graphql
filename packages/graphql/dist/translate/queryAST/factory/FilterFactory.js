import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { fromGlobalId } from "../../../utils/global-ids";
import { asArray, filterTruthy } from "../../../utils/utils";
import { isLogicalOperator } from "../../utils/logical-operators";
import { ConnectionFilter } from "../ast/filters/ConnectionFilter";
import { isRelationshipOperator } from "../ast/filters/Filter";
import { LogicalFilter } from "../ast/filters/LogicalFilter";
import { RelationshipFilter } from "../ast/filters/RelationshipFilter";
import { AggregationDurationFilter } from "../ast/filters/aggregation/AggregationDurationPropertyFilter";
import { AggregationFilter } from "../ast/filters/aggregation/AggregationFilter";
import { AggregationPropertyFilter } from "../ast/filters/aggregation/AggregationPropertyFilter";
import { CountFilter } from "../ast/filters/aggregation/CountFilter";
import { DurationFilter } from "../ast/filters/property-filters/DurationFilter";
import { PointFilter } from "../ast/filters/property-filters/PointFilter";
import { PropertyFilter } from "../ast/filters/property-filters/PropertyFilter";
import { TypenameFilter } from "../ast/filters/property-filters/TypenameFilter";
import { getConcreteEntities } from "../utils/get-concrete-entities";
import { isConcreteEntity } from "../utils/is-concrete-entity";
import { isInterfaceEntity } from "../utils/is-interface-entity";
import { isUnionEntity } from "../utils/is-union-entity";
import { parseAggregationWhereFields, parseConnectionWhereFields, parseWhereField } from "./parsers/parse-where-field";
export class FilterFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createConnectionFilter(relationship, where, filterOps) {
        if (isInterfaceEntity(relationship.target) &&
            this.isLabelOptimizationForInterfacePossible(where, relationship.target)) {
            const connectionFilter = this.createConnectionFilterTreeNode({
                relationship: relationship,
                target: relationship.target,
                isNot: filterOps.isNot,
                operator: filterOps.operator,
            });
            const filters = this.createConnectionPredicates({ rel: relationship, entity: relationship.target, where });
            connectionFilter.addFilters(filters);
            return asArray(connectionFilter);
        }
        const filteredEntities = getConcreteEntities(relationship.target, where);
        const connectionFilters = [];
        let partialOf;
        if (isInterfaceEntity(relationship.target)) {
            partialOf = relationship.target;
        }
        for (const concreteEntity of filteredEntities) {
            const connectionFilter = this.createConnectionFilterTreeNode({
                relationship: relationship,
                target: concreteEntity,
                isNot: filterOps.isNot,
                operator: filterOps.operator,
            });
            const filters = this.createConnectionPredicates({
                rel: relationship,
                entity: concreteEntity,
                where,
                partialOf,
            });
            connectionFilter.addFilters(filters);
            connectionFilters.push(connectionFilter);
        }
        const logicalOp = this.getLogicalOperatorForRelatedNodeFilters(relationship.target, filterOps.operator);
        return this.wrapMultipleFiltersInLogical(connectionFilters, logicalOp);
    }
    createConnectionPredicates({ rel, entity, where, partialOf, }) {
        let entityWhere = where;
        if (rel && isUnionEntity(rel.target) && where[entity.name]) {
            entityWhere = where[entity.name];
        }
        const filters = asArray(entityWhere).flatMap((nestedWhere) => {
            return Object.entries(nestedWhere).flatMap(([key, value]) => {
                if (isLogicalOperator(key)) {
                    const nestedFilters = this.createConnectionPredicates({ rel, entity, where: value, partialOf });
                    return [
                        new LogicalFilter({
                            operation: key,
                            filters: filterTruthy(nestedFilters),
                        }),
                    ];
                }
                const connectionWhereField = parseConnectionWhereFields(key);
                if (rel && connectionWhereField.fieldName === "edge") {
                    return this.createEdgeFilters(rel, value);
                }
                if (connectionWhereField.fieldName === "node") {
                    if (partialOf && isInterfaceEntity(partialOf) && isConcreteEntity(entity)) {
                        return this.createInterfaceNodeFilters({
                            entity: partialOf,
                            targetEntity: entity,
                            whereFields: value,
                        });
                    }
                    else if (isInterfaceEntity(entity)) {
                        return this.createInterfaceNodeFilters({
                            entity,
                            whereFields: value,
                            relationship: rel,
                        });
                    }
                    return this.createNodeFilters(entity, value);
                }
            });
        });
        return filterTruthy(filters);
    }
    createPropertyFilter({ attribute, relationship, comparisonValue, operator, isNot, attachedTo, }) {
        const filterOperator = operator || "EQ";
        if (attribute.typeHelper.isDuration()) {
            return new DurationFilter({
                attribute,
                comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        if (attribute.typeHelper.isPoint() || attribute.typeHelper.isCartesianPoint()) {
            return new PointFilter({
                attribute,
                comparisonValue,
                isNot,
                operator: filterOperator,
                attachedTo,
            });
        }
        return new PropertyFilter({
            attribute,
            relationship,
            comparisonValue,
            isNot,
            operator: filterOperator,
            attachedTo,
        });
    }
    createRelationshipFilter(relationship, where, filterOps) {
        /**
         * The logic below can be confusing, but it's to handle the following cases:
         * 1. where: { actors: null } -> in this case we want to return an Exists filter as showed by tests packages/graphql/tests/tck/null.test.ts
         * 2. where: {} -> in this case we want to not apply any filter, as showed by tests packages/graphql/tests/tck/issues/402.test.ts
         **/
        const isNull = where === null;
        if (!isNull && Object.keys(where).length === 0) {
            return [];
        }
        // this is because if isNull is true we want to wrap the Exist subclause in a NOT, but if isNull is true and isNot is true they negate each other
        const isNot = isNull ? !filterOps.isNot : filterOps.isNot;
        const filteredEntities = getConcreteEntities(relationship.target, where);
        const relationshipFilters = [];
        for (const concreteEntity of filteredEntities) {
            const relationshipFilter = this.createRelationshipFilterTreeNode({
                relationship,
                target: concreteEntity,
                isNot,
                operator: filterOps.operator || "SOME",
            });
            if (!isNull) {
                const entityWhere = where[concreteEntity.name] ?? where;
                const targetNodeFilters = this.createNodeFilters(concreteEntity, entityWhere);
                relationshipFilter.addTargetNodeFilter(...targetNodeFilters);
            }
            relationshipFilters.push(relationshipFilter);
        }
        const logicalOp = this.getLogicalOperatorForRelatedNodeFilters(relationship.target, filterOps.operator);
        return this.wrapMultipleFiltersInLogical(relationshipFilters, logicalOp);
    }
    // This allows to override this creation in AuthorizationFilterFactory
    createRelationshipFilterTreeNode(options) {
        return new RelationshipFilter(options);
    }
    // This allows to override this creation in AuthorizationFilterFactory
    createConnectionFilterTreeNode(options) {
        return new ConnectionFilter(options);
    }
    createInterfaceNodeFilters({ entity, targetEntity, whereFields, relationship, }) {
        const filters = filterTruthy(Object.entries(whereFields).flatMap(([key, value]) => {
            const valueAsArray = asArray(value);
            if (isLogicalOperator(key)) {
                const nestedFilters = valueAsArray.flatMap((nestedWhere) => {
                    return this.createInterfaceNodeFilters({ entity, targetEntity, whereFields: nestedWhere });
                });
                return new LogicalFilter({
                    operation: key,
                    filters: nestedFilters,
                });
            }
            if (key === "typename_IN") {
                const acceptedEntities = entity.concreteEntities.filter((concreteEntity) => {
                    return valueAsArray.some((typenameFilterValue) => typenameFilterValue === concreteEntity.name);
                });
                return new TypenameFilter(acceptedEntities);
            }
            const { fieldName, operator, isNot, isConnection, isAggregate } = parseWhereField(key);
            const relationshipDeclaration = entity.findRelationshipDeclarations(fieldName);
            if (targetEntity && relationshipDeclaration) {
                const relationship = relationshipDeclaration.relationshipImplementations.find((r) => r.source.name === targetEntity.name);
                if (!relationship) {
                    throw new Error(`Relationship ${fieldName} not found`);
                }
                return this.createRelatedNodeFilters({
                    relationship,
                    value,
                    operator,
                    isNot,
                    isConnection,
                    isAggregate,
                });
            }
            const attr = entity.findAttribute(fieldName);
            if (!attr) {
                throw new Error(`Attribute ${fieldName} not found`);
            }
            return this.createPropertyFilter({
                attribute: attr,
                relationship,
                comparisonValue: value,
                isNot,
                operator,
            });
        }));
        return this.wrapMultipleFiltersInLogical(filters);
    }
    createNodeFilters(entity, whereFields) {
        if (isUnionEntity(entity)) {
            return [];
        }
        const filters = filterTruthy(Object.entries(whereFields).flatMap(([key, value]) => {
            const valueAsArray = asArray(value);
            if (isLogicalOperator(key)) {
                const nestedFilters = valueAsArray.flatMap((nestedWhere) => {
                    return this.createNodeFilters(entity, nestedWhere);
                });
                return new LogicalFilter({
                    operation: key,
                    filters: nestedFilters,
                });
            }
            const { fieldName, operator, isNot, isConnection, isAggregate } = parseWhereField(key);
            const relationship = entity.findRelationship(fieldName);
            if (relationship) {
                return this.createRelatedNodeFilters({
                    relationship,
                    value,
                    operator,
                    isNot,
                    isConnection,
                    isAggregate,
                });
            }
            const attr = entity.findAttribute(fieldName);
            if (!attr) {
                if (fieldName === "id" && entity.globalIdField) {
                    return this.createRelayIdPropertyFilter(entity, isNot, operator, value);
                }
                throw new Error(`Attribute ${fieldName} not found`);
            }
            return this.createPropertyFilter({
                attribute: attr,
                comparisonValue: value,
                isNot,
                operator,
            });
        }));
        return this.wrapMultipleFiltersInLogical(filters);
    }
    createRelatedNodeFilters({ relationship, value, operator, isNot, isConnection, isAggregate, }) {
        if (isAggregate) {
            return this.createAggregationFilter(relationship, value);
        }
        if (operator && !isRelationshipOperator(operator)) {
            throw new Error(`Invalid operator ${operator} for relationship`);
        }
        if (isConnection) {
            return this.createConnectionFilter(relationship, value, {
                isNot,
                operator,
            });
        }
        return this.createRelationshipFilter(relationship, value, {
            isNot,
            operator,
        });
    }
    getLogicalOperatorForRelatedNodeFilters(target, operator = "SOME") {
        if (isInterfaceEntity(target)) {
            if (operator === "SOME") {
                return "OR";
            }
            if (operator === "SINGLE") {
                return "XOR";
            }
        }
        return "AND";
    }
    createRelayIdPropertyFilter(entity, isNot, operator, value) {
        const relayIdData = fromGlobalId(value);
        const { typeName, field } = relayIdData;
        let id = relayIdData.id;
        if (typeName !== entity.name || !field || !id) {
            throw new Error(`Cannot query Relay Id on "${entity.name}"`);
        }
        const idAttribute = entity.findAttribute(field);
        if (!idAttribute) {
            throw new Error(`Attribute ${field} not found`);
        }
        if (idAttribute.typeHelper.isNumeric()) {
            id = Number(id);
            if (Number.isNaN(id)) {
                throw new Error("Can't parse non-numeric relay id");
            }
        }
        return this.createPropertyFilter({
            attribute: idAttribute,
            comparisonValue: id,
            isNot,
            operator,
        });
    }
    createEdgeFilters(relationship, where) {
        const filterASTs = Object.entries(where).flatMap(([key, value]) => {
            if (isLogicalOperator(key)) {
                const nestedFilters = asArray(value).flatMap((nestedWhere) => {
                    return this.createEdgeFilters(relationship, nestedWhere);
                });
                return new LogicalFilter({
                    operation: key,
                    filters: nestedFilters,
                });
            }
            const { fieldName, operator, isNot } = parseWhereField(key);
            const attribute = relationship.findAttribute(fieldName);
            if (!attribute) {
                if (fieldName === relationship.propertiesTypeName) {
                    return this.createEdgeFilters(relationship, value);
                }
                return;
            }
            return this.createPropertyFilter({
                attribute,
                comparisonValue: value,
                isNot,
                operator,
                attachedTo: "relationship",
            });
        });
        return this.wrapMultipleFiltersInLogical(filterTruthy(filterASTs));
    }
    getAggregationNestedFilters(where, relationship) {
        const nestedFilters = Object.entries(where).flatMap(([key, value]) => {
            if (isLogicalOperator(key)) {
                const nestedFilters = asArray(value).flatMap((nestedWhere) => {
                    return this.getAggregationNestedFilters(nestedWhere, relationship);
                });
                const logicalFilter = new LogicalFilter({
                    operation: key,
                    filters: nestedFilters,
                });
                return [logicalFilter];
            }
            const { fieldName, operator, isNot } = parseWhereField(key);
            const filterOperator = operator || "EQ";
            if (fieldName === "count") {
                const countFilter = new CountFilter({
                    operator: filterOperator,
                    isNot,
                    comparisonValue: value,
                });
                return [countFilter];
            }
            if (fieldName === "node") {
                return this.createAggregationNodeFilters(value, relationship.target, relationship);
            }
            if (fieldName === "edge") {
                return this.createAggregationNodeFilters(value, relationship);
            }
            throw new Error(`Aggregation filter not found ${key}`);
        });
        return this.wrapMultipleFiltersInLogical(nestedFilters);
    }
    createAggregationFilter(relationship, where) {
        const aggregationFilter = new AggregationFilter(relationship);
        const nestedFilters = this.getAggregationNestedFilters(where, relationship);
        aggregationFilter.addFilters(...nestedFilters);
        return aggregationFilter;
    }
    createAggregationNodeFilters(where, entity, relationship) {
        const filters = Object.entries(where).map(([key, value]) => {
            if (isLogicalOperator(key)) {
                return this.createAggregateLogicalFilter(key, value, entity, relationship);
            }
            // NOTE: if aggregationOperator is undefined, maybe we could return a normal PropertyFilter instead
            const { fieldName, logicalOperator, aggregationOperator } = parseAggregationWhereFields(key);
            const attr = entity.findAttribute(fieldName);
            if (!attr)
                throw new Error(`Attribute ${fieldName} not found`);
            const attachedTo = entity instanceof RelationshipAdapter ? "relationship" : "node";
            if (attr.typeHelper.isDuration()) {
                return new AggregationDurationFilter({
                    attribute: attr,
                    comparisonValue: value,
                    logicalOperator: logicalOperator || "EQUAL",
                    aggregationOperator: aggregationOperator,
                    attachedTo,
                });
            }
            return new AggregationPropertyFilter({
                attribute: attr,
                relationship,
                comparisonValue: value,
                logicalOperator: logicalOperator || "EQUAL",
                aggregationOperator: aggregationOperator,
                attachedTo,
            });
        });
        return this.wrapMultipleFiltersInLogical(filters);
    }
    /** Returns an array of 0 or 1 elements with the filters wrapped using a logical operator if needed */
    wrapMultipleFiltersInLogical(filters, logicalOp = "AND") {
        if (filters.length > 1) {
            return [
                new LogicalFilter({
                    operation: logicalOp,
                    filters,
                }),
            ];
        }
        const singleFilter = filters[0];
        if (singleFilter) {
            return [singleFilter];
        }
        return [];
    }
    createAggregateLogicalFilter(operation, where, entity, relationship) {
        const filters = asArray(where).flatMap((nestedWhere) => {
            return this.createAggregationNodeFilters(nestedWhere, entity, relationship);
        });
        return new LogicalFilter({
            operation,
            filters,
        });
    }
    // This method identifies if it's possible to achieve MATCH (n)-[r]->(m) WHERE m:Movie Or m:Series rather than MATCH (n)-[r]->(m:Movie) Or MATCH (n)-[r]->(m:Series)
    // When filters contain a nested relationship filter this is no longer achievable as the relationship definition is not shared between each concrete entity.
    // For context check TCK test packages/graphql/tests/tck/issues/2709.test.ts --> "should not use a node label so it covers all nodes implementing the interface for connection rel".
    isLabelOptimizationForInterfacePossible(where, entity) {
        if (where.node) {
            const containsUnoptimizableFields = Object.keys(where.node).some((field) => {
                const { fieldName, isAggregate, isConnection } = parseWhereField(field);
                if (isAggregate || isConnection) {
                    return true;
                }
                const relationshipDeclaration = entity.findRelationshipDeclarations(fieldName);
                if (relationshipDeclaration) {
                    return true;
                }
                return false;
            });
            return !containsUnoptimizableFields;
        }
        return true;
    }
}
