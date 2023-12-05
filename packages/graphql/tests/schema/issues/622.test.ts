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

import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { gql } from "graphql-tag";
import { lexicographicSortSchema } from "graphql/utilities";
import { Neo4jGraphQL } from "../../../src";

describe("https://github.com/neo4j/graphql/issues/622", () => {
    test("Support for relationships implementing multiple interfaces", async () => {
        const typeDefs = gql`
            interface Interface_A {
                id: Int!
                Rel_A: [Type_2!]! @relationship(type: "Rel_A", properties: "Rel_A", direction: OUT)
            }

            interface Interface_B {
                id: Int!
                Rel_B: [Type_2!]! @relationship(type: "Rel_B", properties: "Rel_B", direction: OUT)
            }

            interface Rel_A @relationshipProperties {
                timestamp: Int!
            }

            interface Rel_B @relationshipProperties {
                timestamp: Int!
            }

            type Type_1 implements Interface_A & Interface_B {
                id: Int!

                Rel_A: [Type_2!]! @relationship(type: "Rel_A", properties: "Rel_A", direction: OUT)
                Rel_B: [Type_2!]! @relationship(type: "Rel_B", properties: "Rel_B", direction: OUT)
            }

            type Type_2 {
                id: Int!

                inverse__Rel_A: [Interface_A!]! @relationship(type: "Rel_A", properties: "Rel_A", direction: IN)
                inverse__Rel_B: [Interface_B!]! @relationship(type: "Rel_B", properties: "Rel_B", direction: IN)
            }
        `;
        const neoSchema = new Neo4jGraphQL({ typeDefs });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));
        expect(printedSchema).toMatchInlineSnapshot();
    });
});
