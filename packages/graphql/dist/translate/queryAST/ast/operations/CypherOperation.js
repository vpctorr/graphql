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
import { ReadOperation } from "./ReadOperation";
export class CypherOperation extends ReadOperation {
    constructor({ cypherAttributeField, target, relationship, selection, }) {
        super({ target, relationship, selection });
        this.cypherAttributeField = cypherAttributeField;
    }
    transpile(context) {
        // eslint-disable-next-line prefer-const
        let { selection: matchClause, nestedContext } = this.selection.apply(context);
        const fieldSubqueries = Cypher.concat(...this.getFieldsSubqueries(nestedContext), ...this.getCypherFieldsSubqueries(nestedContext));
        const authSubqueries = this.getAuthFilterSubqueries(nestedContext);
        const authPredicates = this.getAuthFilterPredicate(nestedContext);
        const authClauses = authPredicates.length
            ? [...authSubqueries, new Cypher.With("*").where(Cypher.and(...authPredicates))]
            : [];
        const ret = this.getReturnClause(nestedContext, context.returnVariable);
        const clause = Cypher.concat(matchClause, fieldSubqueries, ...authClauses, ret);
        return {
            clauses: [clause],
            projectionExpr: context.returnVariable,
        };
    }
    getReturnClause(context, returnVariable) {
        const projection = this.getProjectionMap(context);
        let returnExpr;
        if (context.shouldCollect) {
            returnExpr = Cypher.collect(context.target);
        }
        else {
            returnExpr = context.target;
        }
        if (context.shouldCollect && !this.cypherAttributeField.typeHelper.isList()) {
            returnExpr = Cypher.head(returnExpr);
        }
        const withClause = new Cypher.With([projection, context.target]);
        if (this.sortFields.length > 0 || this.pagination) {
            this.addSortToClause(context, context.target, withClause);
        }
        return withClause.return([returnExpr, returnVariable]);
    }
}
