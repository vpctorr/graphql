import type { Neo4jGraphQLContextInterface } from "./neo4j-graphql-context-interface";
export interface Neo4jGraphQLSubscriptionsConnectionParams extends Neo4jGraphQLContextInterface {
}
export interface Neo4jGraphQLSubscriptionsContext {
    connectionParams?: Neo4jGraphQLSubscriptionsConnectionParams;
}
