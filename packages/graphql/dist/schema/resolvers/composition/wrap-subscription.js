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
import { getAuthorizationContext } from "./utils/get-authorization-context";
import { DEBUG_GRAPHQL } from "../../../constants";
import { debugGraphQLResolveInfo } from "../../../debug/debug-graphql-resolve-info";
import { debugObject } from "../../../debug/debug-object";
const debug = Debug(DEBUG_GRAPHQL);
export const wrapSubscription = (resolverArgs) => (next) => async (root, args, context, info) => {
    debugGraphQLResolveInfo(debug, info);
    debugObject(debug, "incoming context", context);
    const subscriptionsEngine = resolverArgs.subscriptionsEngine;
    const schemaModel = resolverArgs.schemaModel;
    const authorization = resolverArgs.authorization;
    const jwtClaimsMap = resolverArgs.jwtPayloadFieldsMap;
    const authorizationContext = await getAuthorizationContext(context?.connectionParams || {}, authorization, jwtClaimsMap);
    if (!context.connectionParams?.jwt) {
        context.connectionParams = { ...context.connectionParams, jwt: authorizationContext.jwt };
    }
    const internalContext = {
        authorization: authorizationContext,
        schemaModel,
        subscriptionsEngine,
    };
    return next(root, args, { ...context, ...internalContext }, info);
};
