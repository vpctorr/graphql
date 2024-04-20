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
export class ListAdapter {
    constructor(AttributeAdapter) {
        if (!AttributeAdapter.typeHelper.isList()) {
            throw new Error("Attribute is not a list");
        }
        this.AttributeAdapter = AttributeAdapter;
    }
    getPush() {
        return `${this.AttributeAdapter.name}_PUSH`;
    }
    getPop() {
        return `${this.AttributeAdapter.name}_POP`;
    }
    getIncludes() {
        return `${this.AttributeAdapter.name}_INCLUDES`;
    }
    getNotIncludes() {
        return `${this.AttributeAdapter.name}_NOT_INCLUDES`;
    }
}
