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
import { serializeProperties } from "../../../schema/subscriptions/publish-events-to-subscription-mechanism";
export class CDCEventParser {
    constructor(schemaModel) {
        this.schemaModel = schemaModel;
    }
    parseCDCEvent({ event: cdcEvent, metadata }) {
        const timestamp = metadata.txStartTime.toStandardDate().getTime();
        if (cdcEvent.eventType === "n") {
            return this.parseNodeEvent(cdcEvent, timestamp);
        }
        else {
            // Relationship not supported
            return undefined;
            // return this.parseRelationshipEvent(cdcEvent, timestamp);
        }
    }
    parseNodeEvent(cdcEvent, timestamp) {
        const typenames = this.getTypenamesFromLabels({
            labels: cdcEvent.labels,
            schemaModel: this.schemaModel,
        });
        if (!typenames || !typenames[0])
            return undefined; // What happens with multiple typenames?
        const typename = typenames[0];
        switch (cdcEvent.operation) {
            case "c":
                return {
                    event: "create",
                    typename,
                    properties: {
                        old: undefined,
                        new: serializeProperties(cdcEvent.state.after?.properties) || {},
                    },
                    id: cdcEvent.elementId,
                    timestamp,
                };
            case "d":
                return {
                    event: "delete",
                    typename,
                    properties: {
                        old: serializeProperties(cdcEvent.state.before?.properties) || {},
                        new: undefined,
                    },
                    id: cdcEvent.elementId,
                    timestamp,
                };
            case "u":
                return {
                    event: "update",
                    typename,
                    properties: {
                        old: serializeProperties(cdcEvent.state.before?.properties) || {},
                        new: serializeProperties(cdcEvent.state.after?.properties) || {},
                    },
                    id: cdcEvent.elementId,
                    timestamp,
                };
        }
    }
    parseRelationshipEvent(_cdcEvent, _timestamp) {
        return undefined; // Relationship Events are ignored for now
        // const type = cdcEvent.type;
        // const startTypenames = this.getTypenamesFromLabels({
        //     labels: cdcEvent.start.labels,
        //     schemaModel: this.schemaModel,
        // });
        // if (!startTypenames || !startTypenames[0]) return undefined; // What happens with multiple typenames?
        // // const startTypename = startTypenames[0];
        // const startEntity = this.schemaModel.getEntitiesByLabels(cdcEvent.start.labels);
        // // TODO: Get relationship
        // console.log(cdcEvent);
        // return undefined;
    }
    getTypenamesFromLabels({ labels, schemaModel, }) {
        if (!labels || !labels.length) {
            // Any type should have at least one label
            return undefined;
        }
        return schemaModel.getEntitiesByLabels(labels).map((entity) => entity.name);
    }
}
