import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { AuthenticationAnnotation, AuthenticationOperation } from "../../../schema-model/annotation/AuthenticationAnnotation";
export declare function applyAuthentication({ context, annotation, targetOperations, }: {
    context: Neo4jGraphQLTranslationContext;
    annotation: AuthenticationAnnotation;
    targetOperations: AuthenticationOperation[];
}): void;
