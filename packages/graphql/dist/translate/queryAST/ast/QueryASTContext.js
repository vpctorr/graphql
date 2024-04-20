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
export class QueryASTEnv {
    constructor() {
        this.scopes = new Map();
        this.topLevelOperationName = "READ";
    }
    getScope(element) {
        const scope = this.scopes.get(element);
        if (scope) {
            return scope;
        }
        else {
            const newScope = new Map();
            this.scopes.set(element, newScope);
            return newScope;
        }
    }
}
export class QueryASTContext {
    constructor({ target, relationship, direction, source, env, neo4jGraphQLContext, returnVariable, shouldCollect, shouldDistinct, }) {
        this.target = target;
        this.relationship = relationship;
        this.source = source;
        this.env = env ?? new QueryASTEnv();
        this.neo4jGraphQLContext = neo4jGraphQLContext;
        this.returnVariable = returnVariable ?? new Cypher.Variable();
        this.shouldCollect = shouldCollect ?? false;
        this.shouldDistinct = shouldDistinct ?? false;
        this.direction = direction;
    }
    // TODO: make target always defined
    hasTarget() {
        return Boolean(this.target);
    }
    getRelationshipScope() {
        if (!this.relationship)
            throw new Error("Cannot get relationship scope on top-level context");
        return this.env.getScope(this.relationship);
    }
    getTargetScope() {
        if (!this.target)
            throw new Error("Cannot get target scope on top-level context");
        return this.env.getScope(this.target);
    }
    getScopeVariable(name) {
        const scope = this.getTargetScope();
        const scopeVar = scope.get(name);
        if (!scopeVar) {
            const newVar = new Cypher.Node(); // Using node to keep consistency with `this`
            scope.set(name, newVar);
            return newVar;
        }
        return scopeVar;
    }
    push({ relationship, direction, target, returnVariable, }) {
        return new QueryASTContext({
            source: this.target,
            relationship: relationship,
            direction,
            target: target,
            env: this.env,
            neo4jGraphQLContext: this.neo4jGraphQLContext,
            returnVariable,
        });
    }
    setReturn(variable) {
        return new QueryASTContext({
            source: this.source,
            relationship: this.relationship,
            target: this.target,
            env: this.env,
            neo4jGraphQLContext: this.neo4jGraphQLContext,
            returnVariable: variable,
        });
    }
}
