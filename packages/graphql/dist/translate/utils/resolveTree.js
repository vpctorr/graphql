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
import { removeDuplicates } from "../../utils/utils";
/** Finds a resolve tree of selection based on field name */
export function getResolveTreeByFieldName({ fieldName, selection, }) {
    return Object.values(selection).find((resolveTree) => resolveTree.name === fieldName);
}
/** Finds an aliased resolve tree of selection based on field name */
export function getAliasedResolveTreeByFieldName({ fieldName, selection, }) {
    return Object.values(selection).find((resolveTree) => resolveTree.name === fieldName && resolveTree.alias !== fieldName);
}
/** Generates a field to be used in creating projections */
export function generateResolveTree({ name, alias, args = {}, fieldsByTypeName = {}, }) {
    return {
        [name]: {
            name,
            alias: alias ?? name,
            args,
            fieldsByTypeName,
        },
    };
}
/** Generates missing fields based on an array of fieldNames */
export function generateMissingOrAliasedFields({ fieldNames, selection, }) {
    return removeDuplicates(fieldNames).reduce((acc, fieldName) => {
        const exists = getResolveTreeByFieldName({ fieldName, selection });
        const aliased = getAliasedResolveTreeByFieldName({ fieldName, selection });
        if (!exists || aliased) {
            return { ...acc, ...generateResolveTree({ name: fieldName }) };
        }
        return acc;
    }, {});
}
