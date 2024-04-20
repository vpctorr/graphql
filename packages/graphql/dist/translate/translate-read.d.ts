import type Cypher from "@neo4j/cypher-builder";
import type { EntityAdapter } from "../schema-model/entity/EntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateRead({ context, entityAdapter, varName, }: {
    context: Neo4jGraphQLTranslationContext;
    entityAdapter: EntityAdapter;
    varName?: string;
}): Cypher.CypherResult;
