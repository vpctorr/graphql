import Cypher from "@neo4j/cypher-builder";
import type { FilterOperator } from "../ast/filters/Filter";
/** Returns the default operation for a given filter */
export declare function createComparisonOperation({ operator, property, param, }: {
    operator: FilterOperator;
    property: Cypher.Expr;
    param: Cypher.Expr;
}): Cypher.ComparisonOp;
