import type { Node } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export default function translateCreate({ context, node, }: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
}): Promise<{
    cypher: string;
    params: Record<string, any>;
}>;
