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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EventEmitter } from "events";
import { Memoize } from "typescript-memoize";
import { CDCApi } from "./cdc/cdc-api";
import { CDCEventParser } from "./cdc/cdc-event-parser";
export class Neo4jGraphQLSubscriptionsCDCEngine {
    constructor({ driver, pollTime = 1000, queryConfig, }) {
        this.events = new EventEmitter();
        this.closed = false;
        this.cdcApi = new CDCApi(driver, queryConfig);
        this.pollTime = pollTime;
    }
    // This memoize is done to keep typings correct whilst avoiding the performance ir of the throw
    get parser() {
        if (!this._parser)
            throw new Error("CDC Event parser not available on SubscriptionEngine. Forgot to call .init on SubscriptionEngine?");
        return this._parser;
    }
    publish(_eventMeta) {
        // Disable Default Publishing mechanism
    }
    async init({ schemaModel }) {
        await this.cdcApi.updateCursor();
        this._parser = new CDCEventParser(schemaModel);
        this.triggerPoll();
    }
    /** Stops CDC polling */
    close() {
        this.closed = true;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
    triggerPoll() {
        this.timer = setTimeout(() => {
            if (this.closed) {
                return;
            }
            this.pollEvents()
                .catch((err) => {
                console.error(err);
            })
                .finally(() => {
                this.triggerPoll();
            });
        }, this.pollTime);
    }
    async pollEvents() {
        const cdcEvents = await this.cdcApi.queryEvents();
        for (const cdcEvent of cdcEvents) {
            const parsedEvent = this.parser.parseCDCEvent(cdcEvent);
            if (parsedEvent) {
                this.events.emit(parsedEvent.event, parsedEvent);
            }
        }
    }
}
__decorate([
    Memoize()
], Neo4jGraphQLSubscriptionsCDCEngine.prototype, "parser", null);
