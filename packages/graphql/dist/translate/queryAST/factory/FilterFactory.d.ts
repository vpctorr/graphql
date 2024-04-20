import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { GraphQLWhereArg } from "../../../types";
import type { RelationshipWhereOperator, WhereOperator } from "../../where/types";
import { ConnectionFilter } from "../ast/filters/ConnectionFilter";
import type { Filter } from "../ast/filters/Filter";
import { RelationshipFilter } from "../ast/filters/RelationshipFilter";
import { PropertyFilter } from "../ast/filters/property-filters/PropertyFilter";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class FilterFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    private createConnectionFilter;
    createConnectionPredicates({ rel, entity, where, partialOf, }: {
        rel?: RelationshipAdapter;
        entity: EntityAdapter;
        where: GraphQLWhereArg | GraphQLWhereArg[];
        partialOf?: InterfaceEntityAdapter | UnionEntityAdapter;
    }): Filter[];
    protected createPropertyFilter({ attribute, relationship, comparisonValue, operator, isNot, attachedTo, }: {
        attribute: AttributeAdapter;
        relationship?: RelationshipAdapter;
        comparisonValue: unknown;
        operator: WhereOperator | undefined;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
    }): PropertyFilter;
    private createRelationshipFilter;
    protected createRelationshipFilterTreeNode(options: {
        relationship: RelationshipAdapter;
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
        isNot: boolean;
        operator: RelationshipWhereOperator;
    }): RelationshipFilter;
    protected createConnectionFilterTreeNode(options: {
        relationship: RelationshipAdapter;
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
        isNot: boolean;
        operator: RelationshipWhereOperator | undefined;
    }): ConnectionFilter;
    createInterfaceNodeFilters({ entity, targetEntity, whereFields, relationship, }: {
        entity: InterfaceEntityAdapter;
        targetEntity?: ConcreteEntityAdapter;
        whereFields: Record<string, any>;
        relationship?: RelationshipAdapter;
    }): Filter[];
    createNodeFilters(entity: ConcreteEntityAdapter | UnionEntityAdapter, whereFields: Record<string, any>): Filter[];
    private createRelatedNodeFilters;
    private getLogicalOperatorForRelatedNodeFilters;
    private createRelayIdPropertyFilter;
    createEdgeFilters(relationship: RelationshipAdapter, where: GraphQLWhereArg): Filter[];
    private getAggregationNestedFilters;
    private createAggregationFilter;
    private createAggregationNodeFilters;
    /** Returns an array of 0 or 1 elements with the filters wrapped using a logical operator if needed */
    private wrapMultipleFiltersInLogical;
    private createAggregateLogicalFilter;
    private isLabelOptimizationForInterfacePossible;
}
