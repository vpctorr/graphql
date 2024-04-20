/// <reference types="node" />
import { EventEmitter } from "events";
import type { Driver, QueryConfig } from "neo4j-driver";
import type { Neo4jGraphQLSubscriptionsEngine, SubscriptionEngineContext, SubscriptionsEvent } from "../../types";
export declare class Neo4jGraphQLSubscriptionsCDCEngine implements Neo4jGraphQLSubscriptionsEngine {
    events: EventEmitter;
    private cdcApi;
    private pollTime;
    private _parser;
    private timer;
    private closed;
    constructor({ driver, pollTime, queryConfig, }: {
        driver: Driver;
        pollTime?: number;
        queryConfig?: QueryConfig;
    });
    private get parser();
    publish(_eventMeta: SubscriptionsEvent): void | Promise<void>;
    init({ schemaModel }: SubscriptionEngineContext): Promise<void>;
    /** Stops CDC polling */
    close(): void;
    private triggerPoll;
    private pollEvents;
}
