import type Cypher from "@neo4j/cypher-builder";
import { QueryASTNode } from "../QueryASTNode";
import type { QueryASTContext } from "../QueryASTContext";
export type SortField = [Cypher.Expr, Cypher.Order] | [Cypher.Expr];
export declare abstract class Sort extends QueryASTNode {
    abstract getSortFields(context: QueryASTContext, variable: Cypher.Variable | Cypher.Property, aliased?: boolean): SortField[];
    abstract getProjectionField(context: QueryASTContext): string | Record<string, Cypher.Expr>;
    getSubqueries(_context: QueryASTContext): Cypher.Clause[];
}
