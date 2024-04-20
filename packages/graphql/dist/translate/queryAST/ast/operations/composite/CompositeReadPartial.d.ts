import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { ReadOperation } from "../ReadOperation";
import type { OperationTranspileResult } from "../operations";
export declare class CompositeReadPartial extends ReadOperation {
    transpile(context: QueryASTContext): OperationTranspileResult;
    private transpileNestedCompositeRelationship;
    private transpileTopLevelCompositeEntity;
    protected getProjectionClause(context: QueryASTContext, returnVariable: Cypher.Variable): Cypher.Return;
}
