import type { Neo4jAuthorizationSettings } from "../../types";
import type { JWTPayload } from "jose";
import type { Neo4jGraphQLContext } from "../../types/neo4j-graphql-context";
import type { Neo4jGraphQLSubscriptionsConnectionParams } from "../../types/neo4j-graphql-subscriptions-context";
export declare class Neo4jGraphQLAuthorization {
    private authorization;
    private resolvedKey;
    private unresolvedKey;
    constructor(authorization: Neo4jAuthorizationSettings);
    decode(context: Neo4jGraphQLContext | Neo4jGraphQLSubscriptionsConnectionParams): Promise<JWTPayload | undefined>;
    private serializeKey;
    private resolveKey;
    private verify;
}
