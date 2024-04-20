import type Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../QueryASTContext";
import { QueryASTNode } from "../QueryASTNode";
export type OperationTranspileResult = {
    projectionExpr: Cypher.Expr;
    clauses: Cypher.Clause[];
    extraProjectionColumns?: Array<[Cypher.Expr, Cypher.Variable]>;
};
export declare abstract class Operation extends QueryASTNode {
    abstract transpile(context: QueryASTContext): OperationTranspileResult;
}
export declare abstract class MutationOperation extends Operation {
    abstract transpile(context: QueryASTContext): OperationTranspileResult;
}
