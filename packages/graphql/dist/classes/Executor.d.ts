import type { Driver, QueryResult, Session, SessionMode, Transaction, SessionConfig } from "neo4j-driver";
import type { CypherQueryOptions } from "../types";
import type { GraphQLResolveInfo } from "graphql";
export type ExecutionContext = Driver | Session | Transaction;
export type ExecutorConstructorParam = {
    executionContext: ExecutionContext;
    cypherQueryOptions?: CypherQueryOptions;
    sessionConfig?: SessionConfig;
    cypherParams?: Record<string, unknown>;
    transactionMetadata?: Record<string, unknown>;
};
export type Neo4jGraphQLSessionConfig = Pick<SessionConfig, "database" | "impersonatedUser" | "auth">;
export declare class Executor {
    private executionContext;
    /**
     * @deprecated Will be removed in 5.0.0.
     */
    lastBookmark: string | null;
    private cypherQueryOptions;
    private sessionConfig;
    private cypherParams;
    private transactionMetadata;
    constructor({ executionContext, cypherQueryOptions, sessionConfig, cypherParams, transactionMetadata, }: ExecutorConstructorParam);
    execute(query: string, parameters: Record<string, any>, sessionMode: SessionMode, info?: GraphQLResolveInfo): Promise<QueryResult>;
    private formatError;
    private generateQuery;
    private getTransactionConfig;
    private driverRun;
    private sessionRun;
    private transactionRun;
}
