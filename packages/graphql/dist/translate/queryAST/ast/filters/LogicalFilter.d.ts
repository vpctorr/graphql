import Cypher from "@neo4j/cypher-builder";
import type { LogicalOperators } from "./Filter";
import { Filter } from "./Filter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
export declare class LogicalFilter extends Filter {
    private operation;
    children: Filter[];
    constructor({ operation, filters }: {
        operation: LogicalOperators;
        filters: Filter[];
    });
    getChildren(): QueryASTNode[];
    print(): string;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSelection(context: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
}
