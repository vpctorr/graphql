import type Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { SortField } from "./Sort";
import { Sort } from "./Sort";
export declare class FulltextScoreSort extends Sort {
    private direction;
    private scoreVariable;
    constructor({ scoreVariable, direction }: {
        scoreVariable: Cypher.Variable;
        direction: Cypher.Order;
    });
    getChildren(): QueryASTNode[];
    getSortFields(_context: QueryASTContext, _variable: Cypher.Variable | Cypher.Property): SortField[];
    getProjectionField(_context: QueryASTContext): string | Record<string, Cypher.Expr>;
}
