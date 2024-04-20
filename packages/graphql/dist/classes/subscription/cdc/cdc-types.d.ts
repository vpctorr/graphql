import type { DateTime, Integer } from "neo4j-driver";
type CDCEventState = {
    properties: Record<string, unknown>;
    labels: string[];
};
type CDCEventRelationshipState = {
    properties: Record<string, unknown>;
};
type CDCRelationshipNode = {
    elementId: string;
    labels: string[];
};
type CDCOperation = "c" | "d" | "u";
export type CDCRelationshipEvent = {
    elementId: string;
    eventType: "r";
    start: CDCRelationshipNode;
    end: CDCRelationshipNode;
    state: {
        before?: CDCEventRelationshipState;
        after?: CDCEventRelationshipState;
    };
    operation: CDCOperation;
    type: string;
};
export type CDCNodeEvent = {
    elementId: string;
    eventType: "n";
    state: {
        before?: CDCEventState;
        after?: CDCEventState;
    };
    operation: CDCOperation;
    labels: string[];
};
export type CDCMetadata = {
    txStartTime: DateTime;
};
export type CDCEvent = CDCNodeEvent | CDCRelationshipEvent;
export type CDCQueryResponse = {
    id: string;
    event: CDCEvent;
    metadata: CDCMetadata;
    txId: Integer;
    seq: Integer;
};
export {};
