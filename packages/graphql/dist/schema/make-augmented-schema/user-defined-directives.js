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
import { PROPAGATED_DIRECTIVES } from "../../constants";
import { LIBRARY_DIRECTIVES } from "../../schema-model/library-directives";
import { isInArray } from "../../utils/is-in-array";
function getUserDefinedMergedFieldDirectivesForDefinition(definitionNode) {
    const userDefinedFieldDirectives = new Map();
    for (const field of definitionNode.fields || []) {
        if (!field.directives) {
            return userDefinedFieldDirectives;
        }
        const matched = field.directives.filter((directive) => !isInArray(LIBRARY_DIRECTIVES, directive.name.value));
        if (matched.length) {
            userDefinedFieldDirectives.set(field.name.value, matched);
        }
    }
    return userDefinedFieldDirectives;
}
export function getUserDefinedDirectives(definitionNodes) {
    const userDefinedFieldDirectivesForNode = new Map();
    const userDefinedDirectivesForNode = new Map();
    const propagatedDirectivesForNode = new Map();
    const userDefinedDirectivesForInterface = new Map();
    const userDefinedDirectivesForUnion = new Map();
    for (const definitionNode of definitionNodes.objectTypes) {
        const userDefinedObjectDirectives = definitionNode.directives?.filter((directive) => !isInArray(LIBRARY_DIRECTIVES, directive.name.value)) ||
            [];
        const propagatedDirectives = definitionNode.directives?.filter((directive) => isInArray(PROPAGATED_DIRECTIVES, directive.name.value)) ||
            [];
        userDefinedDirectivesForNode.set(definitionNode.name.value, userDefinedObjectDirectives);
        propagatedDirectivesForNode.set(definitionNode.name.value, propagatedDirectives);
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    for (const definitionNode of definitionNodes.interfaceTypes) {
        const userDefinedInterfaceDirectives = definitionNode.directives?.filter((directive) => !isInArray(LIBRARY_DIRECTIVES, directive.name.value)) ||
            [];
        const propagatedDirectives = definitionNode.directives?.filter((directive) => isInArray(PROPAGATED_DIRECTIVES, directive.name.value)) ||
            [];
        userDefinedDirectivesForInterface.set(definitionNode.name.value, userDefinedInterfaceDirectives);
        propagatedDirectivesForNode.set(definitionNode.name.value, propagatedDirectives);
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    for (const definitionNode of definitionNodes.unionTypes) {
        const userDefinedUnionDirectives = definitionNode.directives?.filter((directive) => !isInArray(LIBRARY_DIRECTIVES, directive.name.value)) ||
            [];
        const propagatedDirectives = definitionNode.directives?.filter((directive) => isInArray(PROPAGATED_DIRECTIVES, directive.name.value)) ||
            [];
        userDefinedDirectivesForUnion.set(definitionNode.name.value, userDefinedUnionDirectives);
        propagatedDirectivesForNode.set(definitionNode.name.value, propagatedDirectives);
    }
    for (const definitionNode of definitionNodes.operations) {
        const userDefinedFieldDirectives = getUserDefinedMergedFieldDirectivesForDefinition(definitionNode);
        userDefinedFieldDirectivesForNode.set(definitionNode.name.value, userDefinedFieldDirectives);
    }
    return {
        userDefinedFieldDirectivesForNode,
        userDefinedDirectivesForNode,
        propagatedDirectivesForNode,
        userDefinedDirectivesForInterface,
        userDefinedDirectivesForUnion,
    };
}
