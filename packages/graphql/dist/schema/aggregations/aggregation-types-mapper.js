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
import { idResolver } from "../resolvers/field/id";
import { numericalResolver } from "../resolvers/field/numerical";
export class AggregationTypesMapper {
    constructor(composer, subgraph) {
        this.subgraph = subgraph;
        this.aggregationSelectionTypes = this.getOrCreateAggregationSelectionTypes(composer);
    }
    getAggregationType(typeName) {
        return this.aggregationSelectionTypes[typeName];
    }
    getOrCreateAggregationSelectionTypes(composer) {
        const composeInt = {
            type: "Int",
            resolve: numericalResolver,
            args: {},
        };
        const composeFloat = {
            type: "Float",
            resolve: numericalResolver,
            args: {},
        };
        const composeId = {
            type: "ID",
            resolve: idResolver,
            args: {},
        };
        const directives = this.subgraph ? [this.subgraph.getFullyQualifiedDirectiveName("shareable")] : [];
        const aggregationSelectionTypeMatrix = [
            {
                name: "ID",
                fields: {
                    shortest: composeId,
                    longest: composeId,
                },
                directives,
            },
            {
                name: "String",
                fields: {
                    shortest: "String",
                    longest: "String",
                },
                directives,
            },
            {
                name: "Float",
                fields: {
                    max: composeFloat,
                    min: composeFloat,
                    average: composeFloat,
                    sum: composeFloat,
                },
                directives,
            },
            {
                name: "Int",
                fields: {
                    max: composeInt,
                    min: composeInt,
                    average: composeFloat,
                    sum: composeInt,
                },
                directives,
            },
            {
                name: "BigInt",
                fields: {
                    max: "BigInt",
                    min: "BigInt",
                    average: "BigInt",
                    sum: "BigInt",
                },
                directives,
            },
            { name: "DateTime" },
            { name: "LocalDateTime" },
            { name: "LocalTime" },
            { name: "Time" },
            { name: "Duration" },
        ];
        const aggregationSelectionTypes = aggregationSelectionTypeMatrix.reduce((res, { name, fields, directives }) => {
            res[name] = this.createType({ composer, name, fields, directives });
            return res;
        }, {});
        return aggregationSelectionTypes;
    }
    createType({ composer, name, fields, directives = [], }) {
        return composer.getOrCreateOTC(`${name}AggregateSelection`, (tc) => {
            tc.addFields(fields ?? { min: name, max: name });
            for (const directive of directives) {
                tc.setDirectiveByName(directive);
            }
        });
    }
}
