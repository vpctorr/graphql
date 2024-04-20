import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipSubscriptionsEvent } from "../../../../../types";
import type { RecordType, RelationshipType } from "../../types";
export declare function filterRelationshipKey({ receivedEventRelationship, where, receivedEvent, }: {
    receivedEventRelationship: RelationshipAdapter;
    where: RecordType | Record<string, RelationshipType | RecordType> | Record<string, RecordType>[];
    receivedEvent: RelationshipSubscriptionsEvent;
}): boolean;
