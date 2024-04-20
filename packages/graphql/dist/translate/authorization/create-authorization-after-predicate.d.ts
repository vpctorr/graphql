import Cypher from "@neo4j/cypher-builder";
import type { AuthorizationOperation } from "../../schema-model/annotation/AuthorizationAnnotation";
import type { PredicateReturn } from "../../types";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
import type { NodeMap } from "./types/node-map";
export declare function createAuthorizationAfterPredicate({ context, nodes, operations, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
}): PredicateReturn | undefined;
export declare function createAuthorizationAfterPredicateField({ context, nodes, operations, conditionForEvaluation, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: NodeMap[];
    operations: AuthorizationOperation[];
    conditionForEvaluation?: Cypher.Predicate;
}): PredicateReturn | undefined;
