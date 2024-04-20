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
import { Operation } from "../operations";
export class CompositeCypherOperation extends Operation {
    constructor({ selection, partials, cypherAttributeField, }) {
        super();
        this.selection = selection;
        this.partials = partials;
        this.cypherAttributeField = cypherAttributeField;
    }
    getChildren() {
        return [this.selection, ...this.partials];
    }
    transpile(context) {
        // eslint-disable-next-line prefer-const
        let { selection: matchClause, nestedContext } = this.selection.apply(context);
        const returnVariable = new Cypher.Variable();
        const partialContext = nestedContext.setReturn(returnVariable);
        const partialClauses = this.partials.map((partial) => {
            const { clauses } = partial.transpile(partialContext);
            return Cypher.concat(new Cypher.With("*"), ...clauses);
        });
        const partialsSubquery = new Cypher.Call(new Cypher.Union(...partialClauses)).return(partialContext.returnVariable);
        const returnExpr = this.getReturnExpression(nestedContext, returnVariable);
        const subquery = new Cypher.Call(partialsSubquery)
            .importWith(nestedContext.target)
            .return([returnExpr, nestedContext.returnVariable]);
        return {
            clauses: [Cypher.concat(matchClause, subquery)],
            projectionExpr: nestedContext.returnVariable,
        };
    }
    getReturnExpression(context, returnVariable) {
        return this.wrapWithHeadIfNeeded(context, this.wrapWithCollectIfNeeded(context, returnVariable));
    }
    wrapWithCollectIfNeeded(context, expr) {
        if (context.shouldCollect) {
            return Cypher.collect(expr);
        }
        return expr;
    }
    wrapWithHeadIfNeeded(context, expr) {
        if (context.shouldCollect && !this.cypherAttributeField.typeHelper.isList()) {
            return Cypher.head(expr);
        }
        return expr;
    }
}
