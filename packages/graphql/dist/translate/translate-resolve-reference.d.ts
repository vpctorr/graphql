import type Cypher from "@neo4j/cypher-builder";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
import type { EntityAdapter } from "../schema-model/entity/EntityAdapter";
export declare function translateResolveReference({ entityAdapter, context, reference, }: {
    context: Neo4jGraphQLTranslationContext;
    entityAdapter: EntityAdapter;
    reference: any;
}): Cypher.CypherResult;
