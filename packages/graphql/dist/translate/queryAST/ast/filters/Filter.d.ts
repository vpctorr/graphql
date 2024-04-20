import { QueryASTNode } from "../QueryASTNode";
import type Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../QueryASTContext";
export type NumericalWhereOperator = "GT" | "GTE" | "LT" | "LTE";
export type SpatialWhereOperator = "DISTANCE";
export type StringWhereOperator = "CONTAINS" | "STARTS_WITH" | "ENDS_WITH";
export type RegexWhereOperator = "MATCHES";
export type ArrayWhereOperator = "IN" | "INCLUDES";
export type RelationshipWhereOperator = "ALL" | "NONE" | "SINGLE" | "SOME";
export type WhereOperator = "NOT" | NumericalWhereOperator | SpatialWhereOperator | StringWhereOperator | `NOT_${StringWhereOperator}` | RegexWhereOperator | ArrayWhereOperator | `NOT_${ArrayWhereOperator}` | RelationshipWhereOperator;
export type FilterOperator = WhereOperator | "EQ";
export type LogicalOperators = "NOT" | "AND" | "OR" | "XOR";
export declare function isRelationshipOperator(operator: string): operator is RelationshipWhereOperator;
export declare abstract class Filter extends QueryASTNode {
    abstract getPredicate(context: QueryASTContext): Cypher.Predicate | undefined;
}
