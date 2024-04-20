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
import Cypher from "@neo4j/cypher-builder";
import { filterTruthy } from "../../../utils/utils";
export class CDCApi {
    constructor(driver, queryConfig) {
        this.cursor = "";
        this.driver = driver;
        this.queryConfig = queryConfig;
    }
    /** Queries events since last call to queryEvents */
    async queryEvents() {
        if (!this.cursor) {
            this.cursor = await this.fetchCurrentChangeId();
        }
        const cursorLiteral = new Cypher.Literal(this.cursor);
        const queryProcedure = CDCProcedures.query(cursorLiteral);
        const events = await this.runProcedure(queryProcedure);
        this.updateChangeIdWithLastEvent(events);
        return events;
    }
    async updateCursor() {
        this.cursor = await this.fetchCurrentChangeId();
    }
    async fetchCurrentChangeId() {
        const currentProcedure = CDCProcedures.current();
        const result = await this.runProcedure(currentProcedure);
        if (result[0] && result[0].id) {
            return result[0].id;
        }
        else {
            throw new Error("id not available on cdc.current");
        }
    }
    updateChangeIdWithLastEvent(events) {
        const lastEvent = events[events.length - 1];
        if (lastEvent) {
            this.cursor = lastEvent.id;
        }
    }
    async runProcedure(procedure) {
        const { cypher, params } = procedure.build();
        const result = await this.driver.executeQuery(cypher, params, this.queryConfig);
        return result.records.map((record) => {
            return record.toObject();
        });
    }
}
/** Wrapper of Cypher Builder for CDC */
class CDCProcedures {
    static current() {
        return new Cypher.Procedure("cdc.current");
    }
    static query(from, selectors) {
        const procedureParams = filterTruthy([from, selectors]);
        return new Cypher.Procedure("cdc.query", procedureParams);
    }
}
