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
import { assertValid, createGraphQLError, DocumentValidationError } from "../utils/document-validation-error";
import { getInheritedTypeNames, hydrateInterfaceWithImplementedTypesMap, } from "../utils/interface-to-implementing-types";
import { getPathToNode } from "../utils/path-parser";
export function ValidRelayID(context) {
    const typeNameToGlobalId = new Map();
    const interfaceToImplementingTypes = new Map();
    const typeNameToAliasedFields = new Map();
    const addToAliasedFieldsMap = function (typeName, fieldName) {
        const x = typeNameToAliasedFields.get(typeName) || new Set();
        fieldName && x.add(fieldName);
        typeNameToAliasedFields.set(typeName, x);
    };
    const getAliasedFieldsFromMap = function (typeName) {
        return typeNameToAliasedFields.get(typeName);
    };
    const doOnObjectType = {
        enter(objectType) {
            hydrateInterfaceWithImplementedTypesMap(objectType, interfaceToImplementingTypes);
        },
        leave(objectType) {
            addToAliasedFieldsMap(objectType.name.value);
            const fieldNamedID = getUnaliasedFieldNamedID(objectType);
            if (!fieldNamedID || !hasGlobalIDField(objectType, typeNameToGlobalId, interfaceToImplementingTypes)) {
                return;
            }
            const inheritedAliasedFields = (getInheritedTypeNames(objectType, interfaceToImplementingTypes) || []).map(getAliasedFieldsFromMap);
            const { isValid, errorMsg, errorPath } = assertValid(() => assertGlobalIDDoesNotClash(inheritedAliasedFields));
            if (!isValid) {
                context.reportError(createGraphQLError({
                    nodes: [objectType, fieldNamedID],
                    path: [objectType.name.value, ...errorPath],
                    errorMsg,
                }));
            }
        },
    };
    const doOnInterfaceType = {
        leave(interfaceType) {
            addToAliasedFieldsMap(interfaceType.name.value);
            const fieldNamedID = getUnaliasedFieldNamedID(interfaceType);
            if (!fieldNamedID || !hasGlobalIDField(interfaceType, typeNameToGlobalId, interfaceToImplementingTypes)) {
                return;
            }
            const inheritedAliasedFields = (getInheritedTypeNames(interfaceType, interfaceToImplementingTypes) || []).map(getAliasedFieldsFromMap);
            const { isValid, errorMsg, errorPath } = assertValid(() => assertGlobalIDDoesNotClash(inheritedAliasedFields));
            if (!isValid) {
                context.reportError(createGraphQLError({
                    nodes: [interfaceType],
                    path: [interfaceType.name.value, ...errorPath],
                    errorMsg,
                }));
            }
        },
    };
    return {
        Directive(directiveNode, _key, _parent, path, ancestors) {
            const [pathToNode, traversedDef, parentOfTraversedDef] = getPathToNode(path, ancestors);
            if (!traversedDef) {
                console.error("No last definition traversed");
                return;
            }
            if (!parentOfTraversedDef) {
                console.error("No parent of last definition traversed");
                return;
            }
            if (directiveNode.name.value === "alias") {
                addToAliasedFieldsMap(parentOfTraversedDef.name.value, traversedDef.name.value);
            }
            if (directiveNode.name.value !== "relayId") {
                return;
            }
            const { isValid, errorMsg, errorPath } = assertValid(() => assertValidGlobalID({
                directiveNode,
                typeDef: parentOfTraversedDef,
                typeNameToGlobalId,
                interfaceToImplementingTypes,
            }));
            if (!isValid) {
                context.reportError(createGraphQLError({
                    nodes: [directiveNode, traversedDef],
                    path: [...pathToNode, ...errorPath],
                    errorMsg,
                }));
            }
        },
        ObjectTypeDefinition: doOnObjectType,
        ObjectTypeExtension: doOnObjectType,
        InterfaceTypeDefinition: doOnInterfaceType,
        InterfaceTypeExtension: doOnInterfaceType,
    };
}
function getUnaliasedFieldNamedID(mainType) {
    const fieldNamedID = mainType.fields?.find((x) => x.name.value === "id");
    if (!fieldNamedID) {
        return;
    }
    const isFieldAliased = !!fieldNamedID.directives?.find((x) => x.name.value === "alias");
    if (!isFieldAliased) {
        return fieldNamedID;
    }
    return;
}
function hasGlobalIDField(mainType, typeNameToGlobalId, interfaceToImplementingTypes) {
    if (typeNameToGlobalId.get(mainType.name.value)) {
        return true;
    }
    return !!getInheritedTypeNames(mainType, interfaceToImplementingTypes)?.find((typeName) => typeNameToGlobalId.get(typeName) === true);
}
function assertGlobalIDDoesNotClash(aliasedFieldsFromInheritedTypes) {
    let shouldDeferCheck = false;
    let hasAlias = false;
    for (const aliasedFields of aliasedFieldsFromInheritedTypes) {
        if (!aliasedFields) {
            shouldDeferCheck = true;
        }
        else {
            if (aliasedFields.has("id")) {
                hasAlias = true;
                return;
            }
        }
    }
    if (hasAlias === false && shouldDeferCheck === false) {
        throw new DocumentValidationError(`Type already has a field \`id\`, which is reserved for Relay global node identification.\nEither remove it, or if you need access to this property, consider using the \`@alias\` directive to access it via another field.`, ["id"]);
    }
}
function assertValidGlobalID({ typeDef, typeNameToGlobalId, interfaceToImplementingTypes, }) {
    if (hasGlobalIDField(typeDef, typeNameToGlobalId, interfaceToImplementingTypes)) {
        throw new DocumentValidationError("Invalid directive usage: Only one field may be decorated with the `@relayId` directive.", ["@relayId"]);
    }
    else {
        typeNameToGlobalId.set(typeDef.name.value, true);
    }
}
