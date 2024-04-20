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
import Cypher from "@neo4j/cypher-builder";
import { createAuthorizationBeforePredicateField, createAuthorizationBeforePredicate, } from "../create-authorization-before-predicate";
import { compilePredicateReturn } from "./compile-predicate-return";
function stringNodeMapToNodeMap(stringNodeMap) {
    return stringNodeMap.map((nodeMap) => {
        return {
            ...nodeMap,
            variable: new Cypher.NamedNode(nodeMap.variable),
        };
    });
}
export function createAuthorizationBeforeAndParams({ context, nodes, operations, indexPrefix, }) {
    const nodeMap = stringNodeMapToNodeMap(nodes);
    const predicateReturn = createAuthorizationBeforePredicate({
        context,
        nodes: nodeMap,
        operations,
    });
    if (predicateReturn) {
        return compilePredicateReturn(predicateReturn, `${indexPrefix || "_"}before_`);
    }
    return undefined;
}
export function createAuthorizationBeforeAndParamsField({ context, nodes, operations, }) {
    const nodeMap = stringNodeMapToNodeMap(nodes);
    const predicateReturn = createAuthorizationBeforePredicateField({
        context,
        nodes: nodeMap,
        operations,
    });
    if (predicateReturn) {
        return compilePredicateReturn(predicateReturn, "_before_");
    }
    return undefined;
}
