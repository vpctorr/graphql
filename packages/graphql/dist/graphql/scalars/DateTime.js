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
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import neo4j, { isDateTime } from "neo4j-driver";
export const GraphQLDateTime = new GraphQLScalarType({
    name: "DateTime",
    description: "A date and time, represented as an ISO-8601 string",
    serialize: (outputValue) => {
        if (typeof outputValue === "string") {
            return new Date(outputValue).toISOString();
        }
        if (isDateTime(outputValue)) {
            return new Date(outputValue.toString()).toISOString();
        }
        throw new GraphQLError(`DateTime cannot represent value: ${outputValue}`);
    },
    parseValue: (inputValue) => {
        if (typeof inputValue === "string") {
            return neo4j.types.DateTime.fromStandardDate(new Date(inputValue));
        }
        if (isDateTime(inputValue)) {
            return inputValue;
        }
        throw new GraphQLError(`DateTime cannot represent non string value: ${inputValue}`);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError("DateTime cannot represent non string value.");
        }
        return neo4j.types.DateTime.fromStandardDate(new Date(ast.value));
    },
});