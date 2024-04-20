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
import { isAuthenticated } from "../../translate/authorization/check-authentication";
export function generateResolverComposition({ schemaModel, isSubscriptionEnabled, queryAndMutationWrappers, subscriptionWrappers, }) {
    const resolverComposition = {};
    const { userCustomResolverPattern: customResolverQueryPattern, generatedResolverPattern: generatedResolverQueryPattern, } = getPathMatcherForRootType("Query", schemaModel);
    resolverComposition[`Query.${customResolverQueryPattern}`] = [
        ...queryAndMutationWrappers,
        isAuthenticated(["READ"], schemaModel.operations.Query),
    ];
    resolverComposition[`Query.${generatedResolverQueryPattern}`] = queryAndMutationWrappers;
    const { userCustomResolverPattern: customResolverMutationPattern, generatedResolverPattern: generatedResolverMutationPattern, } = getPathMatcherForRootType("Mutation", schemaModel);
    resolverComposition[`Mutation.${customResolverMutationPattern}`] = [
        ...queryAndMutationWrappers,
        isAuthenticated(["CREATE", "UPDATE", "DELETE"], schemaModel.operations.Mutation),
    ];
    resolverComposition[`Mutation.${generatedResolverMutationPattern}`] = queryAndMutationWrappers;
    if (isSubscriptionEnabled) {
        resolverComposition["Subscription.*"] = subscriptionWrappers;
    }
    return resolverComposition;
}
function getPathMatcherForRootType(rootType, schemaModel) {
    const operation = schemaModel.operations[rootType];
    if (!operation) {
        return { userCustomResolverPattern: "*", generatedResolverPattern: "*" };
    }
    const userDefinedFields = Array.from(operation.userResolvedAttributes.keys());
    if (!userDefinedFields.length) {
        return { userCustomResolverPattern: "*", generatedResolverPattern: "*" };
    }
    const userCustomResolverPattern = `{${userDefinedFields.join(", ")}}`;
    return { userCustomResolverPattern, generatedResolverPattern: `!${userCustomResolverPattern}` };
}
