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
import { ensureNonEmptyInput } from "../ensure-non-empty-input";
import { withCreateInputType } from "../generation/create-input";
import { concreteEntityToCreateInputFields } from "../to-compose";
export function createOnCreateITC({ schemaComposer, relationshipAdapter, targetEntityAdapter, userDefinedFieldDirectives, }) {
    const onCreateInput = schemaComposer.getOrCreateITC(targetEntityAdapter.operations.onCreateInputTypeName, (tc) => {
        const nodeFields = concreteEntityToCreateInputFields(targetEntityAdapter.onCreateInputFields, userDefinedFieldDirectives);
        tc.addFields(nodeFields);
        ensureNonEmptyInput(schemaComposer, tc);
    });
    const onCreateName = relationshipAdapter.operations.getConnectOrCreateOnCreateFieldInputTypeName(targetEntityAdapter);
    return schemaComposer.getOrCreateITC(onCreateName, (tc) => {
        const onCreateFields = {
            node: onCreateInput.NonNull,
        };
        if (relationshipAdapter.hasCreateInputFields) {
            const edgeFieldType = withCreateInputType({
                entityAdapter: relationshipAdapter,
                userDefinedFieldDirectives,
                composer: schemaComposer,
            });
            onCreateFields["edge"] = relationshipAdapter.hasNonNullCreateInputFields
                ? edgeFieldType.NonNull
                : edgeFieldType;
        }
        tc.addFields(onCreateFields);
    });
}
