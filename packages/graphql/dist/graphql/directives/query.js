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
import { DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLNonNull } from "graphql";
export const queryDirective = new GraphQLDirective({
    name: "query",
    description: "Instructs @neo4j/graphql to exclude read or aggregate operations from the query root type.",
    args: {
        read: {
            description: "Disable/Enabled read operations from query root type",
            type: new GraphQLNonNull(GraphQLBoolean),
            defaultValue: true,
        },
        aggregate: {
            description: "Disable/Enabled aggregate operations from query root type",
            type: new GraphQLNonNull(GraphQLBoolean),
            defaultValue: false,
        },
    },
    locations: [
        DirectiveLocation.OBJECT,
        DirectiveLocation.SCHEMA,
        DirectiveLocation.INTERFACE,
        DirectiveLocation.UNION,
    ],
});
