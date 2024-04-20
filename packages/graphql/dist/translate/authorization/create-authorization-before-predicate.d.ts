import type { AuthorizationOperation } from "../../schema-model/annotation/AuthorizationAnnotation";
import type { PredicateReturn } from "../../types";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
import type { NodeMap } from "./types/node-map";
export declare function createAuthorizationBeforePredicate({ context, nodes, operations, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
}): PredicateReturn | undefined;
export declare function createAuthorizationBeforePredicateField({ context, nodes, operations, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
}): PredicateReturn | undefined;
