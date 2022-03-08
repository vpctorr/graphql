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

import { gql } from "apollo-server";
import { graphql } from "graphql";
import { Driver, Session } from "neo4j-driver";
import { Neo4jGraphQL } from "../../../../src";
import { generateUniqueType, UniqueType } from "../../../utils/graphql-types";
import { TestSubscriptionsPlugin } from "../../../utils/TestSubscriptionPlugin";
import neo4j from "../../neo4j";

describe("Subscriptions delete", () => {
    let driver: Driver;
    let session: Session;
    let neoSchema: Neo4jGraphQL;
    let plugin: TestSubscriptionsPlugin;

    let typeActor: UniqueType;
    let typeMovie: UniqueType;

    beforeAll(async () => {
        driver = await neo4j();
    });

    beforeEach(() => {
        session = driver.session();

        typeActor = generateUniqueType("Actor");
        typeMovie = generateUniqueType("Movie");

        plugin = new TestSubscriptionsPlugin();
        const typeDefs = gql`
            type ${typeActor.name} {
                name: String!
                movies: [${typeMovie.name}!]! @relationship(type: "ACTED_IN", direction: OUT)
            }

            type ${typeMovie.name} {
                id: ID!
                name: String
                actors: [${typeActor.name}!]! @relationship(type: "ACTED_IN", direction: IN)
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            config: { enableRegex: true },
            plugins: {
                subscriptions: plugin,
            } as any,
        });
    });

    afterEach(async () => {
        await session.close();
    });

    afterAll(async () => {
        await driver.close();
    });

    test("simple update with subscriptions enabled", async () => {
        const query = `
        mutation {
            ${typeMovie.operations.update}(where: { id: "1" }, update: { name: "The Matrix" }) {
                ${typeMovie.plural} {
                    id
                }
            }
        }
        `;

        await session.run(`
            CREATE (:${typeMovie.name} { id: "1", name: "Terminator" })
            CREATE (:${typeMovie.name} { id: "2", name: "The Many Adventures of Winnie the Pooh" })
        `);

        const gqlResult: any = await graphql({
            schema: await neoSchema.getSchema(),
            source: query,
            contextValue: { driver },
        });

        expect(gqlResult.errors).toBeUndefined();

        expect(plugin.eventList).toEqual([
            {
                id: expect.any(Number),
                timestamp: expect.any(Number),
                event: "update",
                properties: { old: { id: "1", name: "Terminator" }, new: { id: "1", name: "The Matrix" } },
            },
        ]);
    });

    test("multiple nodes update with subscriptions enabled", async () => {
        const query = `
        mutation {
            ${typeMovie.operations.update}(where: { id_IN: ["1", "2"] }, update: { name: "The Matrix" }) {
                ${typeMovie.plural} {
                    id
                }
            }
        }
        `;

        await session.run(`
            CREATE (:${typeMovie.name} { id: "1", name: "Terminator" })
            CREATE (:${typeMovie.name} { id: "2", name: "The Many Adventures of Winnie the Pooh" })
        `);

        const gqlResult: any = await graphql({
            schema: await neoSchema.getSchema(),
            source: query,
            contextValue: { driver },
        });

        expect(gqlResult.errors).toBeUndefined();

        expect(plugin.eventList).toHaveLength(2);
        expect(plugin.eventList).toEqual(
            expect.arrayContaining([
                {
                    id: expect.any(Number),
                    timestamp: expect.any(Number),
                    event: "update",
                    properties: { old: { id: "1", name: "Terminator" }, new: { id: "1", name: "The Matrix" } },
                },
                {
                    id: expect.any(Number),
                    timestamp: expect.any(Number),
                    event: "update",
                    properties: {
                        old: { id: "2", name: "The Many Adventures of Winnie the Pooh" },
                        new: { id: "2", name: "The Matrix" },
                    },
                },
            ])
        );
    });
});
