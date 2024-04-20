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
import { Kind } from "graphql";
import { containsDirective } from "./utils";
function findDirectiveByTypeName(typeName, enricherContext, directiveName) {
    const userDocumentObject = enricherContext.userDefinitionNodeMap[typeName];
    const userDocumentExtensions = enricherContext.userDefinitionNodeMap[`${userDocumentObject?.name.value}_EXTENSIONS`];
    if ((userDocumentObject && containsDirective(userDocumentObject, directiveName)) ||
        (userDocumentExtensions && userDocumentExtensions.find((e) => containsDirective(e, directiveName)))) {
        return true;
    }
    return false;
}
// Enriches the directive definition itself
export function definitionsEnricher(enricherContext, directiveName, createDefinitionFn) {
    return (accumulatedDefinitions, definition) => {
        switch (definition.kind) {
            case Kind.INTERFACE_TYPE_DEFINITION:
            case Kind.OBJECT_TYPE_DEFINITION: {
                const typeName = definition.name.value;
                const hasDirective = findDirectiveByTypeName(typeName, enricherContext, directiveName);
                if (hasDirective) {
                    const definitions = createDefinitionFn(typeName, enricherContext.augmentedSchema);
                    accumulatedDefinitions.push(...definitions);
                }
            }
        }
        accumulatedDefinitions.push(definition);
        return accumulatedDefinitions;
    };
}
