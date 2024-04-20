import type { GraphQLResolveInfo } from "graphql";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../composition/wrap-subscription";
import type { SubscriptionEventType } from "../types";
export declare function checkAuthenticationOnSelectionSet(resolveInfo: GraphQLResolveInfo, entityAdapter: ConcreteEntityAdapter, type: SubscriptionEventType, context: Neo4jGraphQLComposedSubscriptionsContext): void;
