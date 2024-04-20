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
import { Kind, parse } from "graphql";
import { generateResolveTree } from "../translate/utils/resolveTree";
const INVALID_DIRECTIVES_TO_REQUIRE = ["customResolver"];
export const INVALID_REQUIRED_FIELD_ERROR = `It is not possible to require fields that use the following directives: ${INVALID_DIRECTIVES_TO_REQUIRE.map((name) => `\`@${name}\``).join(", ")}`;
export const INVALID_SELECTION_SET_ERROR = "Invalid selection set passed to @customResolver required";
export function getCustomResolverMeta({ field, object, objects, interfaces, unions, customResolvers, interfaceField, }) {
    const directive = field.directives?.find((x) => x.name.value === "customResolver") ||
        interfaceField?.directives?.find((x) => x.name.value === "customResolver");
    if (!directive) {
        return undefined;
    }
    if (object.kind !== Kind.INTERFACE_TYPE_DEFINITION && !customResolvers?.[field.name.value]) {
        console.warn(`Custom resolver for ${field.name.value} has not been provided`);
    }
    const directiveRequiresArgument = directive?.arguments?.find((arg) => arg.name.value === "requires");
    if (!directiveRequiresArgument) {
        return {
            requiredFields: {},
        };
    }
    if (directiveRequiresArgument?.value.kind !== Kind.STRING) {
        throw new Error("@customResolver requires expects a string");
    }
    const selectionSetDocument = parse(`{ ${directiveRequiresArgument.value.value} }`);
    const requiredFieldsResolveTree = selectionSetToResolveTree(object.fields || [], objects, interfaces, unions, selectionSetDocument);
    if (requiredFieldsResolveTree) {
        return {
            requiredFields: requiredFieldsResolveTree,
        };
    }
}
export function selectionSetToResolveTree(objectFields, objects, interfaces, unions, document) {
    if (document.definitions.length !== 1) {
        throw new Error(INVALID_SELECTION_SET_ERROR);
    }
    const selectionSetDocument = document.definitions[0];
    if (!selectionSetDocument || selectionSetDocument.kind !== Kind.OPERATION_DEFINITION) {
        throw new Error(INVALID_SELECTION_SET_ERROR);
    }
    return nestedSelectionSetToResolveTrees(objectFields, objects, interfaces, unions, selectionSetDocument.selectionSet);
}
function nestedSelectionSetToResolveTrees(objectFields, objects, interfaces, unions, selectionSet, outerFieldType) {
    const result = selectionSet.selections.reduce((acc, selection) => {
        let nestedResolveTree = {};
        if (selection.kind === Kind.FRAGMENT_SPREAD) {
            throw new Error("Fragment spreads are not supported in @customResolver requires");
        }
        if (selection.kind === Kind.INLINE_FRAGMENT) {
            if (!selection.selectionSet) {
                return acc;
            }
            const fieldType = selection.typeCondition?.name.value;
            if (!fieldType) {
                throw new Error(INVALID_SELECTION_SET_ERROR);
            }
            const innerObjectFields = objects.find((obj) => obj.name.value === fieldType)?.fields;
            if (!innerObjectFields) {
                throw new Error(INVALID_SELECTION_SET_ERROR);
            }
            const nestedResolveTree = nestedSelectionSetToResolveTrees(innerObjectFields, objects, interfaces, unions, selection.selectionSet);
            return {
                ...acc,
                [fieldType]: nestedResolveTree,
            };
        }
        if (selection.selectionSet) {
            const field = objectFields.find((field) => field.name.value === selection.name.value);
            const fieldType = getNestedType(field?.type);
            const innerObjectFields = getInnerObjectFields({ fieldType, objects, interfaces, unions });
            nestedResolveTree = nestedSelectionSetToResolveTrees(innerObjectFields, objects, interfaces, unions, selection.selectionSet, fieldType);
        }
        validateRequiredField({ selection, outerFieldType, objectFields, objects });
        if (outerFieldType) {
            return {
                ...acc,
                [outerFieldType]: {
                    ...acc[outerFieldType],
                    ...generateResolveTree({
                        name: selection.name.value,
                        fieldsByTypeName: nestedResolveTree,
                    }),
                },
            };
        }
        return {
            ...acc,
            ...generateResolveTree({
                name: selection.name.value,
                fieldsByTypeName: nestedResolveTree,
            }),
        };
    }, {});
    return result;
}
function getNestedType(type) {
    if (!type) {
        throw new Error(INVALID_SELECTION_SET_ERROR);
    }
    if (type.kind !== Kind.NAMED_TYPE) {
        return getNestedType(type.type);
    }
    return type.name.value;
}
function getInnerObjectFields({ fieldType, objects, interfaces, unions, }) {
    const unionImplementations = unions.find((union) => union.name.value === fieldType)?.types;
    const innerObjectFields = [...objects, ...interfaces].find((obj) => obj.name.value === fieldType)?.fields ||
        unionImplementations?.flatMap((implementation) => [...objects, ...interfaces].find((obj) => obj.name.value === implementation.name.value)?.fields || []);
    if (!innerObjectFields) {
        throw new Error(INVALID_SELECTION_SET_ERROR);
    }
    return innerObjectFields;
}
function validateRequiredField({ selection, outerFieldType, objectFields, objects, }) {
    const fieldImplementations = [objectFields.find((field) => field.name.value === selection.name.value)];
    const objectsImplementingInterface = objects.filter((obj) => obj.interfaces?.find((inter) => inter.name.value === outerFieldType));
    objectsImplementingInterface.forEach((obj) => obj.fields?.forEach((objField) => {
        if (objField.name.value === selection.name.value) {
            fieldImplementations.push(objField);
        }
    }));
    if (fieldImplementations.find((field) => field?.directives?.find((directive) => INVALID_DIRECTIVES_TO_REQUIRE.includes(directive.name.value)))) {
        throw new Error(INVALID_REQUIRED_FIELD_ERROR);
    }
}
