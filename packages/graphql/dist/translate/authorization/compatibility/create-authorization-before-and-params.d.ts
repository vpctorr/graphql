import type { Node } from "../../../types";
import type { AuthorizationOperation } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
type AuthorizationBeforeAndParams = {
    cypher: string;
    params: Record<string, any>;
    subqueries?: string;
};
type StringNodeMap = {
    node: Node;
    variable: string;
    fieldName?: string;
};
export declare function createAuthorizationBeforeAndParams({ context, nodes, operations, indexPrefix, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
    indexPrefix?: string;
}): AuthorizationBeforeAndParams | undefined;
export declare function createAuthorizationBeforeAndParamsField({ context, nodes, operations, }: {
    context: Neo4jGraphQLTranslationContext;
    nodes: StringNodeMap[];
    operations: AuthorizationOperation[];
}): AuthorizationBeforeAndParams | undefined;
export {};
