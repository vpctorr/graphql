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
import { Neo4jGraphQLError } from "../../../../classes";
import { AUTHORIZATION_UNAUTHENTICATED } from "../../../../constants";
import { filterByValues } from "../../../../translate/authorization/utils/filter-by-values";
export function checkAuthentication({ authenticated, operation, context, }) {
    const schemaLevelAnnotation = context.schemaModel.annotations.authentication;
    if (schemaLevelAnnotation && schemaLevelAnnotation.operations.has(operation)) {
        applyAuthentication(schemaLevelAnnotation, context);
    }
    const annotation = authenticated.annotations.authentication;
    if (annotation && annotation.operations.has(operation)) {
        applyAuthentication(annotation, context);
    }
}
function applyAuthentication(annotation, context) {
    if (!context.authorization.jwt) {
        throw new Neo4jGraphQLError(AUTHORIZATION_UNAUTHENTICATED);
    }
    if (annotation.jwt) {
        const { jwt, claims } = context.authorization;
        const result = filterByValues(annotation.jwt, jwt, claims);
        if (!result) {
            throw new Neo4jGraphQLError(AUTHORIZATION_UNAUTHENTICATED);
        }
    }
}
