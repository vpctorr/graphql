import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { GraphQLWhereArg } from "../../../types";
import type { AuthorizationOperation } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { RelationshipWhereOperator, WhereOperator } from "../../where/types";
import type { ConnectionFilter } from "../ast/filters/ConnectionFilter";
import type { Filter } from "../ast/filters/Filter";
import type { RelationshipFilter } from "../ast/filters/RelationshipFilter";
import { PropertyFilter } from "../ast/filters/property-filters/PropertyFilter";
import { FilterFactory } from "./FilterFactory";
export declare class AuthFilterFactory extends FilterFactory {
    createAuthFilters({ entity, operations, context, populatedWhere, }: {
        entity: ConcreteEntityAdapter;
        operations: AuthorizationOperation[];
        context: Neo4jGraphQLTranslationContext;
        populatedWhere: GraphQLWhereArg;
    }): Filter[];
    private createJWTFilters;
    createPropertyFilter({ attribute, comparisonValue, operator, isNot, attachedTo, relationship, }: {
        attribute: AttributeAdapter;
        comparisonValue: unknown;
        operator: WhereOperator | undefined;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
        relationship?: RelationshipAdapter;
    }): PropertyFilter;
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
}
