import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import { QueryASTContext } from "./QueryASTContext";
import type { Operation, OperationTranspileResult } from "./operations/operations";
export declare class QueryAST {
    private operation;
    constructor(operation: Operation);
    build(neo4jGraphQLContext: Neo4jGraphQLTranslationContext, varName?: string): Cypher.Clause;
    buildNew(neo4jGraphQLContext: Neo4jGraphQLTranslationContext, varName?: string): Cypher.Clause;
    /**
     * Transpile the QueryAST to a Cypher builder tree, this is used temporary to transpile incomplete trees, helpful to migrate the legacy code
     **/
    transpile(context: QueryASTContext): OperationTranspileResult;
    buildQueryASTContext(neo4jGraphQLContext: Neo4jGraphQLTranslationContext, varName?: string): QueryASTContext;
    getTargetFromOperation(neo4jGraphQLContext: Neo4jGraphQLTranslationContext, varName: string): Cypher.Node | undefined;
    print(): string;
}
