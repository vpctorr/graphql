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
import Debug from "debug";
import { Executor } from "../../../classes/Executor";
import { getNeo4jDatabaseInfo } from "../../../classes/Neo4jDatabaseInfo";
import { DEBUG_GRAPHQL } from "../../../constants";
import { debugGraphQLResolveInfo } from "../../../debug/debug-graphql-resolve-info";
import { debugObject } from "../../../debug/debug-object";
import { getAuthorizationContext } from "./utils/get-authorization-context";
const debug = Debug(DEBUG_GRAPHQL);
let neo4jDatabaseInfo;
export const wrapQueryAndMutation = ({ driver, nodes, relationships, jwtPayloadFieldsMap, schemaModel, dbInfo, authorization, features, }) => (next) => async (root, args, context, info) => {
    debugGraphQLResolveInfo(debug, info);
    debugObject(debug, "incoming context", context);
    if (!context?.executionContext) {
        if (!driver) {
            throw new Error("A Neo4j driver instance must either be passed to Neo4jGraphQL on construction, or a driver, session or transaction passed as context.executionContext in each request.");
        }
        context.executionContext = driver;
    }
    const subscriptionsEnabled = Boolean(features.subscriptions);
    const authorizationContext = await getAuthorizationContext(context, authorization, jwtPayloadFieldsMap);
    if (!context.jwt) {
        context.jwt = authorizationContext.jwt;
    }
    const executor = new Executor({
        executionContext: context.executionContext,
        cypherQueryOptions: context.cypherQueryOptions,
        sessionConfig: context.sessionConfig,
        cypherParams: context.cypherParams,
        transactionMetadata: context.transactionMetadata,
    });
    if (dbInfo) {
        neo4jDatabaseInfo = dbInfo;
    }
    if (!neo4jDatabaseInfo?.version) {
        neo4jDatabaseInfo = await getNeo4jDatabaseInfo(executor);
    }
    const internalContext = {
        nodes,
        relationships,
        schemaModel,
        features,
        subscriptionsEnabled,
        executor,
        authorization: authorizationContext,
    };
    const finalContext = {
        // Some TCK tests override this value to generate version-specific Cypher
        neo4jDatabaseInfo,
        ...context,
        ...internalContext,
    };
    return next(root, args, finalContext, info);
};
