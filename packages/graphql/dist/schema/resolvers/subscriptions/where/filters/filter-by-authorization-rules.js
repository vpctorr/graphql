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
import { filterByValues } from "../../../../../translate/authorization/utils/filter-by-values";
import { filterRelationshipKey } from "../utils/filter-relationship-key";
import { multipleConditionsAggregationMap } from "../utils/multiple-conditions-aggregation-map";
import { filterByProperties } from "./filter-by-properties";
function isRelationshipSubscriptionsEvent(event) {
    return ["create_relationship", "delete_relationship"].includes(event.event);
}
export function filterByAuthorizationRules({ entityAdapter, where, event, context, }) {
    const receivedEventProperties = event.properties;
    const results = Object.entries(where).map(([wherePropertyKey, wherePropertyValue]) => {
        if (Object.keys(multipleConditionsAggregationMap).includes(wherePropertyKey)) {
            const comparisonResultsAggregationFn = multipleConditionsAggregationMap[wherePropertyKey];
            let comparisonResults;
            if (wherePropertyKey === "NOT") {
                comparisonResults = filterByAuthorizationRules({
                    entityAdapter,
                    where: wherePropertyValue,
                    event,
                    context,
                });
            }
            else {
                comparisonResults = wherePropertyValue.map((whereCl) => {
                    return filterByAuthorizationRules({
                        entityAdapter,
                        where: whereCl,
                        event,
                        context,
                    });
                });
            }
            if (!comparisonResultsAggregationFn(comparisonResults)) {
                return false;
            }
        }
        if (wherePropertyKey === "node") {
            switch (event.event) {
                case "create":
                    return filterByProperties({
                        attributes: entityAdapter.attributes,
                        whereProperties: wherePropertyValue,
                        receivedProperties: event.properties.new,
                    });
                case "update":
                case "delete":
                    return filterByProperties({
                        attributes: entityAdapter.attributes,
                        whereProperties: wherePropertyValue,
                        receivedProperties: event.properties.old,
                    });
                case "create_relationship":
                case "delete_relationship": {
                    const receivedEventRelationshipType = event.relationshipName;
                    // TODO: this was f.type
                    const relationships = Array.from(entityAdapter.relationships.values()).filter((f) => f.type === receivedEventRelationshipType);
                    if (!relationships.length) {
                        return false;
                    }
                    const receivedEventRelationship = relationships[0]; // ONE relationship only possible
                    const key = receivedEventRelationship.direction === "IN" ? "to" : "from";
                    return filterByProperties({
                        attributes: entityAdapter.attributes,
                        whereProperties: wherePropertyValue,
                        receivedProperties: receivedEventProperties[key],
                    });
                }
            }
        }
        if (wherePropertyKey === "relationship") {
            // if (!nodes || !relationshipFields || !isRelationshipSubscriptionsEvent(event)) {
            if (!isRelationshipSubscriptionsEvent(event)) {
                return false;
            }
            const receivedEventRelationshipType = event.relationshipName;
            // TODO: this was f.typeUnescaped
            const relationships = Array.from(entityAdapter.relationships.values()).filter((f) => f.type === receivedEventRelationshipType);
            const receivedEventRelationship = relationships[0]; // ONE relationship only possible
            if (!receivedEventRelationship) {
                return false;
            }
            return filterRelationshipKey({
                receivedEventRelationship,
                where: wherePropertyValue,
                receivedEvent: event,
            });
        }
        if (wherePropertyKey === "jwt") {
            const { jwt, claims } = context.authorization;
            if (!jwt) {
                throw new Error("JWT Token must be present.");
            }
            return filterByValues(wherePropertyValue, jwt, claims);
        }
        return true;
    });
    return multipleConditionsAggregationMap.AND(results);
}
