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
import { createNodeFromEntity } from "../utils/create-node-from-entity";
import { QueryASTContext, QueryASTEnv } from "./QueryASTContext";
import { AggregationOperation } from "./operations/AggregationOperation";
import { ConnectionReadOperation } from "./operations/ConnectionReadOperation";
import { ReadOperation } from "./operations/ReadOperation";
import { DeleteOperation } from "./operations/DeleteOperation";
export class QueryAST {
    constructor(operation) {
        this.operation = operation;
    }
    build(neo4jGraphQLContext, varName) {
        const context = this.buildQueryASTContext(neo4jGraphQLContext, varName);
        return Cypher.concat(...this.transpile(context).clauses);
    }
    // TODO: refactor other top level operations to use this method instead of build
    buildNew(neo4jGraphQLContext, varName) {
        const context = this.buildQueryASTContext(neo4jGraphQLContext, varName);
        const { clauses, projectionExpr, extraProjectionColumns } = this.transpile(context);
        const returnClause = varName ? new Cypher.Return([projectionExpr, varName]) : new Cypher.Return(projectionExpr);
        if (extraProjectionColumns) {
            for (const projectionColumn of extraProjectionColumns) {
                returnClause.addColumns(projectionColumn);
            }
        }
        return Cypher.concat(...clauses, returnClause);
    }
    /**
     * Transpile the QueryAST to a Cypher builder tree, this is used temporary to transpile incomplete trees, helpful to migrate the legacy code
     **/
    transpile(context) {
        return this.operation.transpile(context);
    }
    buildQueryASTContext(neo4jGraphQLContext, varName = "this") {
        const queryASTEnv = new QueryASTEnv();
        const returnVariable = new Cypher.NamedVariable(varName);
        const node = this.getTargetFromOperation(neo4jGraphQLContext, varName);
        return new QueryASTContext({
            target: node,
            env: queryASTEnv,
            neo4jGraphQLContext,
            returnVariable,
        });
    }
    getTargetFromOperation(neo4jGraphQLContext, varName) {
        if (this.operation instanceof ReadOperation ||
            this.operation instanceof ConnectionReadOperation ||
            this.operation instanceof DeleteOperation) {
            return createNodeFromEntity(this.operation.target, neo4jGraphQLContext, varName);
        }
        if (this.operation instanceof AggregationOperation) {
            return createNodeFromEntity(this.operation.entity, neo4jGraphQLContext, varName);
        }
    }
    print() {
        const resultLines = getTreeLines(this.operation);
        return resultLines.join("\n");
    }
}
function getTreeLines(treeNode, depth = 0) {
    const nodeName = treeNode.print();
    const resultLines = [];
    const line = "────";
    if (depth === 0) {
        resultLines.push(`${nodeName}`);
    }
    else if (depth === 1) {
        resultLines.push(`|${line} ${nodeName}`);
    }
    else {
        // fillerLength is the line length repeated by the depth (minus 1 for the first line),
        // in case of depth > 2 there are two pipes rather than one.
        let fillerLength = (line.length + 1) * (depth - 1);
        if (depth > 2) {
            fillerLength += depth - 2;
        }
        resultLines.push(`|${" ".repeat(fillerLength)}|${line} ${nodeName}`);
    }
    const children = treeNode.getChildren();
    if (children.length > 0) {
        children.forEach((curr) => {
            const childLines = getTreeLines(curr, depth + 1);
            resultLines.push(...childLines);
        });
    }
    return resultLines;
}
