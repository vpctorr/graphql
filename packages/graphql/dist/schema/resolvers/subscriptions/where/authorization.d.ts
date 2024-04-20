import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { SubscriptionsEvent } from "../../../../types";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../composition/wrap-subscription";
export declare function subscriptionAuthorization({ event, entity, context, }: {
    event: SubscriptionsEvent;
    entity: ConcreteEntityAdapter;
    context: Neo4jGraphQLComposedSubscriptionsContext;
}): boolean;
