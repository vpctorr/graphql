/// <reference types="node" />
import { EventEmitter } from "events";
import type { Neo4jGraphQLSubscriptionsEngine, SubscriptionsEvent } from "@neo4j/graphql";
import type { ConnectionOptions } from "./amqp-0-9-1-api";
export { ConnectionOptions } from "./amqp-0-9-1-api";
type AmqpVersion = "0-9-1";
export type Neo4jGraphQLAMQPSubscriptionsEngineConstructorOptions = {
    connection: ConnectionOptions;
    amqpVersion?: AmqpVersion;
    exchange?: string;
    reconnectTimeout?: number;
    log?: boolean;
};
export declare class Neo4jGraphQLAMQPSubscriptionsEngine implements Neo4jGraphQLSubscriptionsEngine {
    events: EventEmitter;
    private amqpApi;
    private connectionOptions;
    constructor(options: Neo4jGraphQLAMQPSubscriptionsEngineConstructorOptions);
    init(): Promise<void>;
    close(): Promise<void>;
    publish(eventMeta: SubscriptionsEvent): Promise<void>;
}
