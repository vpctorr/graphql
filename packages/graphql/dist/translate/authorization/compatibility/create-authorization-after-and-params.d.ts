import type { Node } from "../../../types";
import type { AuthorizationOperation } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
type AuthorizationAfterAndParams = {
    cypher: string;
    params: Record<string, any>;
    subqueries?: string;
};
type StringNodeMap = {
    node: Node;
    variable: string;
    fieldName?: string;
};
export declare function createAuthorizationAfterAndParams({ context, nodes, operations, indexPrefix, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
    indexPrefix?: string;
}): AuthorizationAfterAndParams | undefined;
export declare function createAuthorizationAfterAndParamsField({ context, nodes, operations, indexPrefix, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
    indexPrefix?: string;
}): AuthorizationAfterAndParams | undefined;
export {};
