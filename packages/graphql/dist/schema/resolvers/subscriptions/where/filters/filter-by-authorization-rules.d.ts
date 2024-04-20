import type { SubscriptionsAuthorizationWhere } from "../../../../../schema-model/annotation/SubscriptionsAuthorizationAnnotation";
import type { ConcreteEntityAdapter } from "../../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { SubscriptionsEvent } from "../../../../../types";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../../composition/wrap-subscription";
import type { RecordType, RelationshipType } from "../../types";
export declare function filterByAuthorizationRules({ entityAdapter, where, event, context, }: {
    entityAdapter: ConcreteEntityAdapter;
    where: SubscriptionsAuthorizationWhere | Record<string, RecordType | Record<string, RecordType | RelationshipType> | Array<Record<string, RecordType>>>;
    event: SubscriptionsEvent;
    context: Neo4jGraphQLComposedSubscriptionsContext;
}): boolean;
