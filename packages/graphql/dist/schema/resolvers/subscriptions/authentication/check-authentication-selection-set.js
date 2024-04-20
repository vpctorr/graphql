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
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { checkAuthentication } from "./check-authentication";
import { parseSelectionSetForAuthenticated } from "./selection-set-parser";
export function checkAuthenticationOnSelectionSet(resolveInfo, entityAdapter, type, context) {
    const resolveTree = parseResolveInfo(resolveInfo);
    if (!resolveTree) {
        return;
    }
    const authenticatedSelections = parseSelectionSetForAuthenticated({
        resolveTree,
        entity: entityAdapter,
        entityTypeName: entityAdapter.operations.subscriptionEventTypeNames[type],
        entityPayloadTypeName: entityAdapter.operations.subscriptionEventPayloadFieldNames[type],
        context,
    });
    authenticatedSelections.forEach(({ entity, fieldSelection }) => checkAuthenticationOnSelection({ entity, fieldSelection, context }));
}
function checkAuthenticationOnSelection({ fieldSelection, entity, context, }) {
    checkAuthentication({ authenticated: entity, operation: "READ", context });
    for (const selectedField of Object.values(fieldSelection)) {
        const field = entity.attributes.get(selectedField.name);
        if (field) {
            checkAuthentication({ authenticated: field, operation: "READ", context });
        }
    }
}
