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
import { Neo4jError } from "neo4j-driver";
import Debug from "debug";
import environment from "../environment";
import { Neo4jGraphQLAuthenticationError, Neo4jGraphQLConstraintValidationError, Neo4jGraphQLForbiddenError, Neo4jGraphQLRelationshipValidationError, } from "./Error";
import { AUTH_FORBIDDEN_ERROR, AUTH_UNAUTHENTICATED_ERROR, DEBUG_EXECUTE, RELATIONSHIP_REQUIREMENT_PREFIX, } from "../constants";
import { print } from "graphql";
import { debugCypherAndParams } from "../debug/debug-cypher-and-params";
const debug = Debug(DEBUG_EXECUTE);
function isDriverLike(executionContext) {
    return typeof executionContext.session === "function";
}
function isSessionLike(executionContext) {
    return typeof executionContext.beginTransaction === "function";
}
export class Executor {
    constructor({ executionContext, cypherQueryOptions, sessionConfig, cypherParams = {}, transactionMetadata = {}, }) {
        this.executionContext = executionContext;
        this.cypherQueryOptions = cypherQueryOptions;
        this.lastBookmark = null;
        this.cypherQueryOptions = cypherQueryOptions;
        this.sessionConfig = sessionConfig;
        this.cypherParams = cypherParams;
        this.transactionMetadata = transactionMetadata;
    }
    async execute(query, parameters, sessionMode, info) {
        const params = { ...parameters, ...this.cypherParams };
        try {
            if (isDriverLike(this.executionContext)) {
                return await this.driverRun({
                    query,
                    parameters: params,
                    driver: this.executionContext,
                    sessionMode,
                    info,
                });
            }
            if (isSessionLike(this.executionContext)) {
                return await this.sessionRun({
                    query,
                    parameters: params,
                    sessionMode,
                    session: this.executionContext,
                    info,
                });
            }
            return await this.transactionRun(query, params, this.executionContext);
        }
        catch (error) {
            throw this.formatError(error);
        }
    }
    formatError(error) {
        if (error instanceof Neo4jError) {
            if (error.message.includes(`Caused by: java.lang.RuntimeException: ${AUTH_FORBIDDEN_ERROR}`)) {
                return new Neo4jGraphQLForbiddenError("Forbidden");
            }
            if (error.message.includes(`Caused by: java.lang.RuntimeException: ${AUTH_UNAUTHENTICATED_ERROR}`)) {
                return new Neo4jGraphQLAuthenticationError("Unauthenticated");
            }
            if (error.message.includes(`Caused by: java.lang.RuntimeException: ${RELATIONSHIP_REQUIREMENT_PREFIX}`)) {
                const [, message] = error.message.split(RELATIONSHIP_REQUIREMENT_PREFIX);
                return new Neo4jGraphQLRelationshipValidationError(message || "");
            }
            if (error.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
                return new Neo4jGraphQLConstraintValidationError("Constraint validation failed");
            }
        }
        debug("%s", error);
        return error;
    }
    generateQuery(query) {
        if (this.cypherQueryOptions && Object.keys(this.cypherQueryOptions).length) {
            const cypherQueryOptions = `CYPHER ${Object.entries(this.cypherQueryOptions)
                .map(([key, value]) => `${key}=${value}`)
                .join(" ")}`;
            return `${cypherQueryOptions}\n${query}`;
        }
        return query;
    }
    getTransactionConfig(info) {
        const app = `${environment.NPM_PACKAGE_NAME}@${environment.NPM_PACKAGE_VERSION}`;
        const transactionConfig = {
            metadata: {
                ...this.transactionMetadata,
                app,
                type: "user-transpiled",
            },
        };
        if (info) {
            const source = {
                // We avoid using print here, when possible, as it is a heavy process
                query: info.operation.loc?.source.body ||
                    // Print both fragments and operation, otherwise printed queries are invalid due to missing fragments
                    [Object.values(info.fragments).map((fragment) => print(fragment)), print(info.operation)].join("\n\n"),
                params: info.variableValues,
            };
            transactionConfig.metadata.source = source;
        }
        return transactionConfig;
    }
    async driverRun({ query, parameters, driver, sessionMode, info, }) {
        const session = driver.session({
            // Always specify a default database to avoid requests for routing table
            database: "neo4j",
            ...this.sessionConfig,
            bookmarkManager: driver.executeQueryBookmarkManager,
            defaultAccessMode: sessionMode,
        });
        try {
            const result = await this.sessionRun({ query, parameters, info, session, sessionMode });
            return result;
        }
        finally {
            await session.close();
        }
    }
    async sessionRun({ query, parameters, session, sessionMode, info, }) {
        let result;
        switch (sessionMode) {
            case "READ":
                result = await session.executeRead((tx) => {
                    return this.transactionRun(query, parameters, tx);
                }, this.getTransactionConfig(info));
                break;
            case "WRITE":
                result = await session.executeWrite((tx) => {
                    return this.transactionRun(query, parameters, tx);
                }, this.getTransactionConfig(info));
                break;
        }
        // TODO: remove in 5.0.0, only kept to not make client breaking changes in 4.0.0
        const lastBookmark = session.lastBookmarks();
        if (lastBookmark[0]) {
            this.lastBookmark = lastBookmark[0];
        }
        return result;
    }
    transactionRun(query, parameters, transaction) {
        const queryToRun = this.generateQuery(query);
        debugCypherAndParams(debug, queryToRun, parameters);
        return transaction.run(queryToRun, parameters);
    }
}
