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

import { GraphQLResolveInfo } from "graphql";
import getNeo4jResolveTree from "../../utils/get-neo4j-resolve-tree";
import { execute } from "../../utils";
import { translateDelete } from "../../translate";
import { Context } from "../../types";
import { Node } from "../../classes";

export default function deleteResolver({ node }: { node: Node }) {
    async function resolve(_root: any, _args: any, _context: unknown, info: GraphQLResolveInfo) {
        const context = _context as Context;
        context.resolveTree = getNeo4jResolveTree(info);
        const [cypher, params] = translateDelete({ context, node, args: _args });
        const executeResult = await execute({
            cypher,
            params,
            defaultAccessMode: "WRITE",
            context,
        });

        return { bookmark: executeResult.bookmark, ...executeResult.statistics };
    }

    return {
        type: `DeleteInfo!`,
        resolve,
        args: {
            where: `${node.name}Where`,
            ...(node.relationFields.length
                ? {
                      delete: `${node.name}DeleteInput`,
                  }
                : {}),
        },
    };
}
