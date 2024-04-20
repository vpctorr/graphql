import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { SubscriptionsEvent } from "../../../../types";
import type { RecordType, RelationshipType } from "../types";
export declare function subscriptionWhere({ where, event, entityAdapter, }: {
    where: Record<string, RecordType | RelationshipType> | undefined;
    event: SubscriptionsEvent;
    entityAdapter: ConcreteEntityAdapter;
}): boolean;
