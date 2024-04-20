import type { ConcreteEntityAdapter } from "../../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipSubscriptionsEvent } from "../../../../../types";
import type { RecordType, RelationshipType } from "../../types";
export declare function filterByRelationshipProperties({ entityAdapter, whereProperties, receivedEvent, }: {
    entityAdapter: ConcreteEntityAdapter;
    whereProperties: Record<string, RecordType | Record<string, RecordType | RelationshipType> | Array<Record<string, RecordType>>>;
    receivedEvent: RelationshipSubscriptionsEvent;
}): boolean;
