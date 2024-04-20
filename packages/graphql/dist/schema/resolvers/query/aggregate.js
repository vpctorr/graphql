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
import { translateAggregate } from "../../../translate";
import { execute } from "../../../utils";
import getNeo4jResolveTree from "../../../utils/get-neo4j-resolve-tree";
import { isConcreteEntity } from "../../../translate/queryAST/utils/is-concrete-entity";
export function aggregateResolver({ entityAdapter, }) {
    async function resolve(_root, _args, context, info) {
        const resolveTree = getNeo4jResolveTree(info);
        context.resolveTree = resolveTree;
        const { cypher, params } = translateAggregate({
            context: context,
            entityAdapter: entityAdapter,
        });
        const executeResult = await execute({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
            info,
        });
        return Object.values(executeResult.records[0] || {})[0];
    }
    return {
        type: `${entityAdapter.operations.aggregateTypeNames.selection}!`,
        resolve,
        args: {
            where: entityAdapter.operations.whereInputTypeName,
            ...(isConcreteEntity(entityAdapter) && entityAdapter.annotations.fulltext
                ? {
                    fulltext: {
                        type: entityAdapter.operations.fullTextInputTypeName,
                        description: "Query a full-text index. Allows for the aggregation of results, but does not return the query score. Use the root full-text query fields if you require the score.",
                    },
                }
                : {}),
        },
    };
}
