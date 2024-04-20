import Cypher from "@neo4j/cypher-builder";
import type { CypherField } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function translateTopLevelCypher({ context, field, type, }: {
    context: Neo4jGraphQLTranslationContext;
    field: CypherField;
    type: "Query" | "Mutation";
}): Cypher.CypherResult;
