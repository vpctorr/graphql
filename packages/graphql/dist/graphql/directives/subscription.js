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
import { DirectiveLocation, GraphQLDirective, GraphQLEnumType, GraphQLList, GraphQLNonNull } from "graphql";
export var SubscriptionEvent;
(function (SubscriptionEvent) {
    SubscriptionEvent["CREATED"] = "CREATED";
    SubscriptionEvent["UPDATED"] = "UPDATED";
    SubscriptionEvent["DELETED"] = "DELETED";
    SubscriptionEvent["RELATIONSHIP_CREATED"] = "RELATIONSHIP_CREATED";
    SubscriptionEvent["RELATIONSHIP_DELETED"] = "RELATIONSHIP_DELETED";
})(SubscriptionEvent || (SubscriptionEvent = {}));
const SubscriptionEventType = new GraphQLEnumType({
    name: "SubscriptionEvent",
    values: {
        [SubscriptionEvent.CREATED]: { value: SubscriptionEvent.CREATED },
        [SubscriptionEvent.UPDATED]: { value: SubscriptionEvent.UPDATED },
        [SubscriptionEvent.DELETED]: { value: SubscriptionEvent.DELETED },
        [SubscriptionEvent.RELATIONSHIP_CREATED]: { value: SubscriptionEvent.RELATIONSHIP_CREATED },
        [SubscriptionEvent.RELATIONSHIP_DELETED]: { value: SubscriptionEvent.RELATIONSHIP_DELETED },
    },
});
export const subscriptionDirective = new GraphQLDirective({
    name: "subscription",
    description: "Define the granularity of events available in the subscription root type.",
    args: {
        events: {
            description: "Enable/Disable subscription events for this type",
            type: new GraphQLNonNull(new GraphQLList(SubscriptionEventType)),
            defaultValue: [
                SubscriptionEvent.CREATED,
                SubscriptionEvent.UPDATED,
                SubscriptionEvent.DELETED,
                SubscriptionEvent.RELATIONSHIP_CREATED,
                SubscriptionEvent.RELATIONSHIP_DELETED,
            ],
        },
    },
    locations: [DirectiveLocation.OBJECT, DirectiveLocation.SCHEMA],
});
