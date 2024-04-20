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
import { filterTruthy } from "../../../../utils/utils";
import { ReadOperation } from "./ReadOperation";
export class FulltextOperation extends ReadOperation {
    constructor({ target, relationship, scoreField, selection, }) {
        super({
            target,
            relationship,
            selection,
        });
        this.scoreField = scoreField;
    }
    transpile(context) {
        const { clauses, projectionExpr } = super.transpile(context);
        const extraProjectionColumns = [];
        if (this.scoreField) {
            const scoreProjection = this.scoreField.getProjectionField(context.returnVariable);
            extraProjectionColumns.push([scoreProjection.score, new Cypher.NamedVariable("score")]);
        }
        return {
            clauses,
            projectionExpr,
            extraProjectionColumns,
        };
    }
    getChildren() {
        return filterTruthy([...super.getChildren(), this.scoreField]);
    }
    getReturnStatement(context, returnVariable) {
        const returnClause = super.getReturnStatement(context, returnVariable);
        if (this.scoreField) {
            const scoreProjection = this.scoreField.getProjectionField(returnVariable);
            returnClause.addColumns([scoreProjection.score, "score"]);
        }
        return returnClause;
    }
}
