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
import { GraphQLInt, GraphQLNonNull, GraphQLString, } from "graphql";
import { PageInfo } from "../../../graphql/objects/PageInfo";
import { translateRead } from "../../../translate";
import { execute } from "../../../utils";
import getNeo4jResolveTree from "../../../utils/get-neo4j-resolve-tree";
import { isNeoInt } from "../../../utils/utils";
import { createConnectionWithEdgeProperties } from "../../pagination";
import { graphqlDirectivesToCompose } from "../../to-compose";
export function rootConnectionResolver({ composer, entityAdapter, propagatedDirectives, }) {
    async function resolve(_root, args, context, info) {
        const resolveTree = getNeo4jResolveTree(info, { args });
        context.resolveTree = resolveTree;
        const { cypher, params } = translateRead({
            context: context,
            entityAdapter: entityAdapter,
            varName: "this",
        });
        const executeResult = await execute({
            cypher,
            params,
            defaultAccessMode: "READ",
            context,
        });
        let totalCount = 0;
        let edges = [];
        let pageInfo = {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
        };
        if (executeResult.records[0]) {
            const record = executeResult.records[0].this;
            totalCount = isNeoInt(record.totalCount) ? record.totalCount.toNumber() : record.totalCount;
            const connection = createConnectionWithEdgeProperties({
                selectionSet: resolveTree,
                source: { edges: record.edges },
                args: { first: args.first, after: args.after },
                totalCount,
            });
            // TODO: Question why are these not taking into account the potential aliases?
            edges = connection.edges;
            pageInfo = connection.pageInfo;
        }
        return {
            totalCount,
            edges,
            pageInfo,
        };
    }
    const rootEdge = composer.createObjectTC({
        name: `${entityAdapter.name}Edge`,
        fields: {
            cursor: new GraphQLNonNull(GraphQLString),
            node: `${entityAdapter.name}!`,
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
    const rootConnection = composer.createObjectTC({
        name: `${entityAdapter.upperFirstPlural}Connection`,
        fields: {
            totalCount: new GraphQLNonNull(GraphQLInt),
            pageInfo: new GraphQLNonNull(PageInfo),
            edges: rootEdge.NonNull.List.NonNull,
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
    // since sort is not created when there is nothing to sort, we check for its existence
    let sortArg;
    if (composer.has(entityAdapter.operations.sortInputTypeName)) {
        sortArg = composer.getITC(entityAdapter.operations.sortInputTypeName);
    }
    return {
        type: rootConnection.NonNull,
        resolve,
        args: {
            first: GraphQLInt,
            after: GraphQLString,
            where: entityAdapter.operations.whereInputTypeName,
            ...(sortArg ? { sort: sortArg.List } : {}),
            ...(entityAdapter.annotations.fulltext
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