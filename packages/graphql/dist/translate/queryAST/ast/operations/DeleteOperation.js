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
import { wrapSubqueriesInCypherCalls } from "../../utils/wrap-subquery-in-calls";
import { MutationOperation } from "./operations";
export class DeleteOperation extends MutationOperation {
    constructor({ target, selection, nestedOperations = [], filters = [], authFilters = [], }) {
        super();
        this.target = target;
        this.selection = selection;
        this.filters = filters;
        this.authFilters = authFilters;
        this.nestedOperations = nestedOperations;
    }
    getChildren() {
        return [this.selection, ...this.filters, ...this.authFilters, ...this.nestedOperations];
    }
    transpile(context) {
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        const { selection, nestedContext } = this.selection.apply(context);
        if (nestedContext.relationship) {
            return this.transpileNested(selection, nestedContext);
        }
        return this.transpileTopLevel(selection, nestedContext);
    }
    transpileTopLevel(selection, context) {
        this.validateSelection(selection);
        const filterSubqueries = wrapSubqueriesInCypherCalls(context, this.filters, [context.target]);
        const authBeforeSubqueries = this.getAuthFilterSubqueries(context);
        const predicate = this.getPredicate(context);
        const extraSelections = this.getExtraSelections(context);
        const nestedOperations = this.getNestedDeleteSubQueries(context);
        let statements = [selection, ...extraSelections, ...filterSubqueries, ...authBeforeSubqueries];
        statements = this.appendFilters(statements, predicate);
        if (nestedOperations.length) {
            statements.push(new Cypher.With("*"), ...nestedOperations);
        }
        statements = this.appendDeleteClause(statements, context);
        const ret = Cypher.concat(...statements);
        return { clauses: [ret], projectionExpr: context.target };
    }
    transpileNested(selection, context) {
        this.validateSelection(selection);
        if (!context.relationship) {
            throw new Error("Transpile error: No relationship found!");
        }
        const filterSubqueries = wrapSubqueriesInCypherCalls(context, this.filters, [context.target]);
        const authBeforeSubqueries = this.getAuthFilterSubqueries(context);
        const predicate = this.getPredicate(context);
        const extraSelections = this.getExtraSelections(context);
        const collect = Cypher.collect(context.target).distinct();
        const deleteVar = new Cypher.Variable();
        const withBeforeDeleteBlock = new Cypher.With(context.relationship, [collect, deleteVar]);
        const unwindDeleteVar = new Cypher.Variable();
        const deleteClause = new Cypher.Unwind([deleteVar, unwindDeleteVar]).detachDelete(unwindDeleteVar);
        const deleteBlock = new Cypher.Call(deleteClause).importWith(deleteVar);
        const nestedOperations = this.getNestedDeleteSubQueries(context);
        const statements = this.appendFilters([selection, ...extraSelections, ...filterSubqueries, ...authBeforeSubqueries], predicate);
        if (nestedOperations.length) {
            statements.push(new Cypher.With("*"), ...nestedOperations);
        }
        statements.push(withBeforeDeleteBlock, deleteBlock);
        const ret = Cypher.concat(...statements);
        return { clauses: [ret], projectionExpr: Cypher.Null };
    }
    appendDeleteClause(clauses, context) {
        const lastClause = this.getLastClause(clauses);
        if (lastClause instanceof Cypher.Match ||
            lastClause instanceof Cypher.OptionalMatch ||
            lastClause instanceof Cypher.With) {
            lastClause.detachDelete(context.target);
            return clauses;
        }
        const extraWith = new Cypher.With("*");
        extraWith.detachDelete(context.target);
        clauses.push(extraWith);
        return clauses;
    }
    getLastClause(clauses) {
        const lastClause = clauses[clauses.length - 1];
        if (!lastClause) {
            throw new Error("Transpile error");
        }
        return lastClause;
    }
    appendFilters(clauses, predicate) {
        if (!predicate) {
            return clauses;
        }
        const lastClause = this.getLastClause(clauses);
        if (lastClause instanceof Cypher.Match ||
            lastClause instanceof Cypher.OptionalMatch ||
            lastClause instanceof Cypher.With) {
            lastClause.where(predicate);
            return clauses;
        }
        const withClause = new Cypher.With("*");
        withClause.where(predicate);
        clauses.push(withClause);
        return clauses;
    }
    getNestedDeleteSubQueries(context) {
        const nestedOperations = [];
        for (const nestedDeleteOperation of this.nestedOperations) {
            const { clauses } = nestedDeleteOperation.transpile(context);
            nestedOperations.push(...clauses.map((c) => new Cypher.Call(c).importWith("*")));
        }
        return nestedOperations;
    }
    validateSelection(selection) {
        if (!(selection instanceof Cypher.Match || selection instanceof Cypher.With)) {
            throw new Error("Cypher Yield statement is not a valid selection for Delete Operation");
        }
    }
    getPredicate(queryASTContext) {
        const authBeforePredicates = this.getAuthFilterPredicate(queryASTContext);
        return Cypher.and(...this.filters.map((f) => f.getPredicate(queryASTContext)), ...authBeforePredicates);
    }
    getAuthFilterSubqueries(context) {
        return this.authFilters.flatMap((f) => f.getSubqueries(context));
    }
    getAuthFilterPredicate(context) {
        return filterTruthy(this.authFilters.map((f) => f.getPredicate(context)));
    }
    getExtraSelections(context) {
        return this.getChildren().flatMap((f) => f.getSelection(context));
    }
}
