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
import { mergeDeep, asArray } from "@graphql-tools/utils";
/**
 * Given a `ResolveTree` or array of `ResolveTree`s and a list of typeNames, return a `FieldsByTypeName` object field with the matched fields.
 */
export function getFieldsByTypeName(resolveTree, typeNames) {
    return mergeDeep(asArray(resolveTree).map((resolveTreeField) => {
        return asArray(typeNames).reduce((acc, typeName) => {
            return { ...acc, ...resolveTreeField?.fieldsByTypeName[typeName] };
        }, {});
    }));
}
