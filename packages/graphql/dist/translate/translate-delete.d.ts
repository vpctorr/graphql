import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { EntityAdapter } from "../schema-model/entity/EntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateDelete({ context, node, entityAdapter, }: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    entityAdapter: EntityAdapter;
}): Cypher.CypherResult;
