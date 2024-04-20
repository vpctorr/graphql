import type { Node } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export default function translateUpdate({ node, context, }: {
    node: Node;
    context: Neo4jGraphQLTranslationContext;
}): Promise<[string, any]>;
