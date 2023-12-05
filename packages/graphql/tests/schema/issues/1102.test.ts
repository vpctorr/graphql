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

describe("https://github.com/neo4j/graphql/issues/1102", () => {
    test("Support for types implementing multiple interfaces", async () => {
        const typeDefs = gql`
            type Address {
                id: ID! @id
                locates: [WithAddress!]! @relationship(type: "ADDRESS", direction: OUT)
            }

            type OrganisationNumber {
                value: String! @unique
                identifies: [WithOrganisationIdentifier!]! @relationship(type: "ORGNR", direction: OUT)
            }

            interface WithAddress {
                address: Address! @relationship(type: "ADDRESS", direction: IN)
            }

            interface WithOrganisationIdentifier {
                orgNr: OrganisationNumber! @relationship(type: "ORGNR", direction: IN)
            }

            type Controller implements WithAddress & WithOrganisationIdentifier {
                name: String!
                address: Address! @relationship(type: "ADDRESS", direction: IN)
                orgNr: OrganisationNumber! @relationship(type: "ORGNR", direction: IN)
            }

            type Processor implements WithAddress & WithOrganisationIdentifier {
                name: String!
                address: Address! @relationship(type: "ADDRESS", direction: IN)
                orgNr: OrganisationNumber! @relationship(type: "ORGNR", direction: IN)
            }
        `;
        const neoSchema = new Neo4jGraphQL({ typeDefs });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));
        expect(printedSchema).toMatchInlineSnapshot();
    });
});
