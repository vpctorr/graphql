import type { GraphQLWhereArg } from "../types";
import type { Node } from "../classes";
import Cypher from "@neo4j/cypher-builder";
import type { AuthorizationOperation } from "../schema-model/annotation/AuthorizationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateTopLevelMatch({ matchNode, node, context, operation, where, }: {
    matchNode: Cypher.Node;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    operation: AuthorizationOperation;
    where: GraphQLWhereArg | undefined;
}): Cypher.CypherResult;
