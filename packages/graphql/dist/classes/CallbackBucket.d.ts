import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
interface Callback {
    functionName: string;
    paramName: string;
    parent?: Record<string, unknown>;
}
export declare class CallbackBucket {
    callbacks: Callback[];
    private context;
    constructor(context: Neo4jGraphQLTranslationContext);
    addCallback(callback: Callback): void;
    resolveCallbacksAndFilterCypher(options: {
        cypher: string;
    }): Promise<{
        cypher: string;
        params: Record<string, unknown>;
    }>;
}
export {};
