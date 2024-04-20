import type { ResolversComposerMapping } from "@graphql-tools/resolvers-composition";
import type { IResolvers } from "@graphql-tools/utils";
import type { GraphQLResolveInfo } from "graphql";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
export declare function generateResolverComposition({ schemaModel, isSubscriptionEnabled, queryAndMutationWrappers, subscriptionWrappers, }: {
    schemaModel: Neo4jGraphQLSchemaModel;
    isSubscriptionEnabled: boolean;
    queryAndMutationWrappers: ((next: any) => (root: any, args: any, context: any, info: any) => any)[];
    subscriptionWrappers: ((next: any) => (root: any, args: any, context: any, info: any) => any)[];
}): ResolversComposerMapping<IResolvers<any, GraphQLResolveInfo, Record<string, any>, any>>;
