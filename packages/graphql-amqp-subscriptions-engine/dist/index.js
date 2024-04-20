/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { EventEmitter } from "events";
import { AmqpApi } from "./amqp-0-9-1-api";
const DEFAULT_EXCHANGE = "neo4j.graphql.subscriptions.fx";
const DEFAULT_VERSION = "0-9-1";
export class Neo4jGraphQLAMQPSubscriptionsEngine {
    constructor(options) {
        const defaultOptions = { exchange: DEFAULT_EXCHANGE, amqpVersion: DEFAULT_VERSION, log: true };
        const finalOptions = { ...defaultOptions, ...options };
        this.events = new EventEmitter();
        this.amqpApi = new AmqpApi({
            exchange: finalOptions.exchange,
            reconnectTimeout: finalOptions.reconnectTimeout,
            log: finalOptions.log,
        });
        this.connectionOptions = options.connection;
    }
    init() {
        return this.amqpApi.connect(this.connectionOptions, (message) => {
            this.events.emit(message.event, message);
        });
    }
    /* Closes the connection and unbinds the event emitter */
    close() {
        this.events.removeAllListeners();
        return this.amqpApi.close();
    }
    publish(eventMeta) {
        this.amqpApi.publish(eventMeta);
        return Promise.resolve(); // To avoid future breaking changes, we always return a promise
    }
}
