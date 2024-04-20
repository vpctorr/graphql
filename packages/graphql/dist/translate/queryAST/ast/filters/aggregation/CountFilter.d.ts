import Cypher from "@neo4j/cypher-builder";
import type { FilterOperator } from "../Filter";
import { Filter } from "../Filter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class CountFilter extends Filter {
    protected comparisonValue: unknown;
    protected operator: FilterOperator;
    protected isNot: boolean;
    constructor({ isNot, operator, comparisonValue, }: {
        operator: FilterOperator;
        isNot: boolean;
        comparisonValue: unknown;
    });
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    getChildren(): QueryASTNode[];
    print(): string;
    /** Returns the default operation for a given filter */
    protected createBaseOperation({ operator, expr, param, }: {
        operator: FilterOperator;
        expr: Cypher.Expr;
        param: Cypher.Expr;
    }): Cypher.ComparisonOp;
}
