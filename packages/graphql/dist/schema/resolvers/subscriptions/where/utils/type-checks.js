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
import { int } from "neo4j-driver";
import { InterfaceEntityAdapter } from "../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
function isIDType(fieldMeta) {
    return fieldMeta?.typeMeta.name === "ID";
}
export function isIDAsString(fieldMeta, value) {
    return isIDType(fieldMeta) && int(value).toString() !== value;
}
export function isInterfaceType(node, receivedEventRelationship) {
    return !!(receivedEventRelationship.target instanceof InterfaceEntityAdapter);
}
export function isStandardType(node, receivedEventRelationship) {
    return !(receivedEventRelationship.target instanceof InterfaceEntityAdapter);
}
export function isInterfaceSpecificFieldType(node) {
    return !!node;
}
