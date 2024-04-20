import type { GraphQLResolveInfo } from "graphql";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { SubscriptionsEvent } from "../../../types";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../composition/wrap-subscription";
import type { SubscriptionEventType } from "./types";
export declare function subscriptionResolve(payload: [SubscriptionsEvent]): SubscriptionsEvent;
type SubscriptionArgs = {
    where?: Record<string, any>;
};
export declare function generateSubscribeMethod({ entityAdapter, type, }: {
    entityAdapter: ConcreteEntityAdapter;
    type: SubscriptionEventType;
}): (_root: any, args: SubscriptionArgs, context: Neo4jGraphQLComposedSubscriptionsContext, resolveInfo: GraphQLResolveInfo) => AsyncIterator<[SubscriptionsEvent]>;
export {};
