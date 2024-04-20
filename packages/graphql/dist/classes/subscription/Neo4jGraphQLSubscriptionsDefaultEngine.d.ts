/// <reference types="node" />
import { EventEmitter } from "events";
import type { Neo4jGraphQLSubscriptionsEngine, SubscriptionsEvent } from "../../types";
export declare class Neo4jGraphQLSubscriptionsDefaultEngine implements Neo4jGraphQLSubscriptionsEngine {
    events: EventEmitter;
    closed: boolean;
    publish(eventMeta: SubscriptionsEvent): void | Promise<void>;
    /** Stops event publishing */
    close(): void;
}
