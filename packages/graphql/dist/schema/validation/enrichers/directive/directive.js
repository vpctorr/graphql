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
import { containsDirective, getDirectiveDefinition } from "./utils";
// Enriches the applied directives on objects, interfaces and fields
export function directiveEnricher(enricherContext, directiveName, transformFn) {
    return (accumulatedDefinitions, definition) => {
        switch (definition.kind) {
            case Kind.INTERFACE_TYPE_DEFINITION:
            case Kind.OBJECT_TYPE_DEFINITION: {
                const typeName = definition.name.value;
                const userDocumentObject = enricherContext.userDefinitionNodeMap[typeName];
                const userDocumentExtensions = enricherContext.userDefinitionNodeMap[`${typeName}_EXTENSIONS`];
                if (userDocumentObject) {
                    let definitionWithEnrichedDirective = containsDirective(userDocumentObject, directiveName)
                        ? changeDirectiveOnObject(definition, userDocumentObject, directiveName, transformFn)
                        : definition;
                    if (userDocumentExtensions) {
                        definitionWithEnrichedDirective = userDocumentExtensions.reduce((prev, curr) => {
                            return containsDirective(curr, directiveName)
                                ? changeDirectiveOnObject(prev, curr, directiveName, transformFn)
                                : prev;
                        }, definitionWithEnrichedDirective);
                    }
                    accumulatedDefinitions.push(definitionWithEnrichedDirective);
                    return accumulatedDefinitions;
                }
            }
        }
        accumulatedDefinitions.push(definition);
        return accumulatedDefinitions;
    };
}
function changeDirectiveOnObject(object, userDocumentObject, directiveName, transformFn) {
    const userDirective = getDirectiveDefinition(userDocumentObject, directiveName);
    const fieldsWithNewDirective = object.fields?.map((field) => changeDirectiveOnField(field, userDocumentObject, directiveName, transformFn));
    const newDirectiveDirective = userDirective && transformFn(userDirective, object.name.value);
    return {
        ...object,
        directives: newDirectiveDirective ? (object.directives ?? []).concat(newDirectiveDirective) : object.directives,
        fields: fieldsWithNewDirective,
    };
}
function changeDirectiveOnField(field, userDocumentObject, directiveName, transformFn) {
    const userField = userDocumentObject.fields?.find((userDefinitionField) => field.name.value === userDefinitionField.name.value);
    const userFieldDirective = userField && getDirectiveDefinition(userField, directiveName);
    if (!userFieldDirective) {
        return field;
    }
    const fieldDirective = transformFn(userFieldDirective, userDocumentObject.name.value);
    return { ...field, directives: (field.directives ?? []).concat(fieldDirective) };
}
