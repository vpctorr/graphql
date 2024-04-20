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
import graphqlFormatter from "./transforms/neo4j-graphql";
import toInternalStruct from "./to-internal-struct";
export async function toGenericStruct(sessionFactory) {
    return toInternalStruct(sessionFactory);
}
export async function toGraphQLTypeDefs(sessionFactory, readonly = false) {
    const genericStruct = await toGenericStruct(sessionFactory);
    return graphqlFormatter(genericStruct, readonly);
}
