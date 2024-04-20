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
import { translateRead } from "../../../translate";
import { execute } from "../../../utils";
import getNeo4jResolveTree from "../../../utils/get-neo4j-resolve-tree";
export function fulltextResolver({ node, index, entityAdapter, }) {
    return async function resolve(_root, args, context, info) {
        context.fulltext = index;
        context.fulltext.scoreVariable = new Cypher.Variable();
        const resolveTree = getNeo4jResolveTree(info, { args });
        resolveTree.args.options = {
            sort: resolveTree.args.sort,
            limit: resolveTree.args.limit,
            offset: resolveTree.args.offset,
        };
        context.resolveTree = resolveTree;
        const { cypher, params } = translateRead({
            context: context,
            entityAdapter,
            varName: node.singular,
        });
        const executeResult = await execute({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
            info,
        });
        return executeResult.records;
    };
}
