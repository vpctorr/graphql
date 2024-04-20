import type { Neo4jGraphQLContext } from "../../types/neo4j-graphql-context";
/**
 * Given a list of strings, representing labels, and a context, replace any labels that start with $ with the value from the context
 **/
export declare function mapLabelsWithContext(labels: string[], context: Neo4jGraphQLContext): string[];
