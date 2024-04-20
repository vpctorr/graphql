import type { Neo4jGraphQLAuthorization } from "../../../../classes/authorization/Neo4jGraphQLAuthorization";
import type { AuthorizationContext } from "../../../../types";
import type { Neo4jGraphQLContext } from "../../../../types/neo4j-graphql-context";
import type { Neo4jGraphQLSubscriptionsConnectionParams } from "../../../../types/neo4j-graphql-subscriptions-context";
export declare function getAuthorizationContext(context: Neo4jGraphQLContext | Neo4jGraphQLSubscriptionsConnectionParams, authorization?: Neo4jGraphQLAuthorization, jwtClaimsMap?: Map<string, string>): Promise<AuthorizationContext>;
