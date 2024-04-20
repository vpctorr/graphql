import Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
type Scope = Map<string, Cypher.Variable>;
export declare class QueryASTEnv {
    private scopes;
    topLevelOperationName: "READ" | "CREATE" | "UPDATE" | "DELETE";
    getScope(element: Cypher.Node | Cypher.Relationship): Scope;
}
type ContextDirection = "left" | "right" | "undirected";
export declare class QueryASTContext<T extends Cypher.Node | undefined = Cypher.Node | undefined> {
    readonly target: T;
    readonly relationship?: Cypher.Relationship;
    readonly direction?: ContextDirection;
    readonly source?: Cypher.Node;
    readonly returnVariable: Cypher.Variable;
    readonly shouldCollect: boolean;
    readonly shouldDistinct: boolean;
    env: QueryASTEnv;
    neo4jGraphQLContext: Neo4jGraphQLTranslationContext;
    constructor({ target, relationship, direction, source, env, neo4jGraphQLContext, returnVariable, shouldCollect, shouldDistinct, }: {
        target: T;
        relationship?: Cypher.Relationship;
        direction?: ContextDirection;
        source?: Cypher.Node;
        env?: QueryASTEnv;
        neo4jGraphQLContext: Neo4jGraphQLTranslationContext;
        returnVariable?: Cypher.Variable;
        shouldCollect?: boolean;
        shouldDistinct?: boolean;
    });
    hasTarget(): this is QueryASTContext<Cypher.Node>;
    getRelationshipScope(): Scope;
    getTargetScope(): Scope;
    getScopeVariable(name: string): Cypher.Variable;
    push({ relationship, direction, target, returnVariable, }: {
        relationship: Cypher.Relationship;
        direction?: ContextDirection;
        target: Cypher.Node;
        returnVariable?: Cypher.Variable;
    }): QueryASTContext<Cypher.Node>;
    setReturn(variable: Cypher.Variable): QueryASTContext<T>;
}
export {};
