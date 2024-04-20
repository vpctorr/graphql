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
import { parse, GraphQLError, GraphQLScalarType, Kind } from "graphql";
export const GraphQLSelectionSet = new GraphQLScalarType({
    name: "SelectionSet",
    description: "A GraphQL SelectionSet without the outer curly braces. It must be passed as a string and is always returned as a string.",
    serialize(outputValue) {
        if (typeof outputValue !== "string") {
            throw new GraphQLError(`SelectionSet cannot represent non string value: ${outputValue}`);
        }
        parseSelectionSet(outputValue);
        return outputValue;
    },
    parseValue(inputValue) {
        if (typeof inputValue !== "string") {
            throw new GraphQLError(`SelectionSet cannot represent non string value: ${inputValue}`);
        }
        parseSelectionSet(inputValue);
        return inputValue;
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`SelectionSet cannot represent non string value`);
        }
        parseSelectionSet(ast.value);
        return ast.value;
    },
});
function parseSelectionSet(input) {
    try {
        parse(`{ ${input} }`);
    }
    catch {
        throw new GraphQLError(`SelectionSet cannot parse the following value: ${input}`);
    }
}
