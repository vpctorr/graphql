import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import type { Neo4jGraphQLAuthorization } from "../../../classes/authorization/Neo4jGraphQLAuthorization";
import type { Neo4jGraphQLSchemaModel } from "../../../schema-model/Neo4jGraphQLSchemaModel";
import type { AuthorizationContext, Neo4jGraphQLSubscriptionsEngine } from "../../../types";
import type { Neo4jGraphQLSubscriptionsContext } from "../../../types/neo4j-graphql-subscriptions-context";
export type WrapSubscriptionArgs = {
    schemaModel: Neo4jGraphQLSchemaModel;
    subscriptionsEngine: Neo4jGraphQLSubscriptionsEngine;
    authorization?: Neo4jGraphQLAuthorization;
    jwtPayloadFieldsMap?: Map<string, string>;
};
export interface Neo4jGraphQLComposedSubscriptionsContext extends Neo4jGraphQLSubscriptionsContext {
    authorization: AuthorizationContext;
    schemaModel: Neo4jGraphQLSchemaModel;
    subscriptionsEngine: Neo4jGraphQLSubscriptionsEngine;
}
export declare const wrapSubscription: (resolverArgs: WrapSubscriptionArgs) => (next: GraphQLFieldResolver<any, Neo4jGraphQLComposedSubscriptionsContext>) => (root: any, args: any, context: Neo4jGraphQLSubscriptionsContext, info: GraphQLResolveInfo) => Promise<unknown>;
