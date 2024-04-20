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
import { hasTarget } from "../../utils/context-has-target";
import { wrapSubqueriesInCypherCalls } from "../../utils/wrap-subquery-in-calls";
import { CypherPropertySort } from "../sort/CypherPropertySort";
import { Operation } from "./operations";
export class ReadOperation extends Operation {
    constructor({ target, relationship, selection, }) {
        super();
        this.fields = [];
        this.filters = [];
        this.authFilters = [];
        this.sortFields = [];
        this.target = target;
        this.relationship = relationship;
        this.selection = selection;
    }
    setFields(fields) {
        this.fields = fields;
    }
    addSort(...sort) {
        this.sortFields.push(...sort);
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    addFilters(...filters) {
        this.filters.push(...filters);
    }
    addAuthFilters(...filter) {
        this.authFilters.push(...filter);
    }
    getAuthFilterSubqueries(context) {
        return this.authFilters.flatMap((f) => f.getSubqueries(context));
    }
    getAuthFilterPredicate(context) {
        return filterTruthy(this.authFilters.map((f) => f.getPredicate(context)));
    }
    getProjectionClause(context, returnVariable, isArray) {
        if (!hasTarget(context)) {
            throw new Error("No parent node found!");
        }
        const projection = this.getProjectionMap(context);
        let aggregationExpr = Cypher.collect(context.target);
        if (!isArray) {
            aggregationExpr = Cypher.head(aggregationExpr);
        }
        const withClause = new Cypher.With([projection, context.target]);
        if (this.sortFields.length > 0 || this.pagination) {
            this.addSortToClause(context, context.target, withClause);
        }
        return withClause.return([aggregationExpr, returnVariable]);
    }
    getPredicates(queryASTContext) {
        return Cypher.and(...this.filters.map((f) => f.getPredicate(queryASTContext)));
    }
    transpile(context) {
        // eslint-disable-next-line prefer-const
        let { selection: matchClause, nestedContext } = this.selection.apply(context);
        const topLevelOperationName = (this.relationship ? context : nestedContext).env.topLevelOperationName;
        const isCreateSelection = topLevelOperationName === "CREATE";
        const isUpdateSelection = topLevelOperationName === "UPDATE";
        if (isCreateSelection || isUpdateSelection) {
            if (!context.hasTarget()) {
                throw new Error("Invalid target for create operation");
            }
            if (!this.relationship) {
                // Match is not applied on mutations (last concat ignores the top level match) so we revert the context apply
                nestedContext = context;
            }
        }
        const filterSubqueries = wrapSubqueriesInCypherCalls(nestedContext, this.filters, [nestedContext.target]);
        const filterPredicates = this.getPredicates(nestedContext);
        const fieldSubqueries = this.getFieldsSubqueries(nestedContext);
        const cypherFieldSubqueries = this.getCypherFieldsSubqueries(nestedContext);
        const sortSubqueries = wrapSubqueriesInCypherCalls(nestedContext, this.sortFields, [nestedContext.target]);
        const authFilterSubqueries = this.getAuthFilterSubqueries(nestedContext).map((sq) => new Cypher.Call(sq).importWith(nestedContext.target));
        const authFiltersPredicate = this.getAuthFilterPredicate(nestedContext);
        const ret = this.relationship
            ? this.getProjectionClause(nestedContext, context.returnVariable, this.relationship.isList)
            : this.getReturnStatement(isCreateSelection || isUpdateSelection ? context : nestedContext, nestedContext.returnVariable);
        let filterSubqueryWith;
        let filterSubqueriesClause;
        // This weird condition is just for cypher compatibility
        const shouldAddWithForAuth = authFilterSubqueries.length || authFiltersPredicate.length;
        if (filterSubqueries.length || shouldAddWithForAuth) {
            filterSubqueriesClause = Cypher.concat(...filterSubqueries);
            if (!isCreateSelection || authFilterSubqueries.length) {
                filterSubqueryWith = new Cypher.With("*");
            }
        }
        let sortAndLimitBlock;
        let subqueries;
        if (this.relationship) {
            subqueries = Cypher.concat(...fieldSubqueries, ...cypherFieldSubqueries, ...sortSubqueries);
        }
        else {
            subqueries = Cypher.concat(...fieldSubqueries);
            let sortClause;
            if (this.sortFields.length || this.pagination) {
                sortClause = new Cypher.With("*");
                this.addSortToClause(nestedContext, nestedContext.target, sortClause);
            }
            const sortBlock = Cypher.concat(...sortSubqueries, sortClause);
            sortAndLimitBlock = this.hasCypherSort()
                ? Cypher.concat(...cypherFieldSubqueries, sortBlock)
                : Cypher.concat(sortBlock, ...cypherFieldSubqueries);
        }
        let clause;
        if (isCreateSelection && !this.relationship) {
            // Top-level read part of a mutation does not contain the MATCH clause as it's implicit in the mutation.
            clause = Cypher.concat(filterSubqueriesClause, filterSubqueryWith, sortAndLimitBlock, subqueries, ret);
        }
        else {
            const extraMatches = this.getChildren().flatMap((f) => f.getSelection(nestedContext));
            let extraMatchesWith;
            const wherePredicate = Cypher.and(filterPredicates, ...authFiltersPredicate);
            if (wherePredicate) {
                if (filterSubqueryWith) {
                    filterSubqueryWith.where(wherePredicate); // TODO: should this only be for aggregation filters?
                }
                else if (extraMatches.length) {
                    extraMatchesWith = new Cypher.With("*").where(wherePredicate);
                }
                else {
                    matchClause.where(wherePredicate);
                }
            }
            const matchBlock = [];
            if (!isUpdateSelection || this.relationship) {
                matchBlock.push(matchClause);
            }
            matchBlock.push(...extraMatches, extraMatchesWith);
            clause = Cypher.concat(...matchBlock, ...authFilterSubqueries, filterSubqueriesClause, filterSubqueryWith, sortAndLimitBlock, subqueries, ret);
        }
        return {
            clauses: [clause],
            projectionExpr: context.returnVariable,
        };
    }
    getReturnStatement(context, returnVariable) {
        const projection = this.getProjectionMap(context);
        if (context.shouldCollect) {
            const collectProj = Cypher.collect(projection);
            if (context.shouldDistinct) {
                collectProj.distinct();
            }
            return new Cypher.Return([collectProj, returnVariable]);
        }
        return new Cypher.Return([projection, returnVariable]);
    }
    hasCypherSort() {
        return this.sortFields.some((s) => s instanceof CypherPropertySort);
    }
    getChildren() {
        return filterTruthy([
            this.selection,
            ...this.filters,
            ...this.authFilters,
            ...this.fields,
            this.pagination,
            ...this.sortFields,
        ]);
    }
    getFieldsSubqueries(context) {
        const nonCypherFields = this.fields.filter((f) => !f.isCypherField());
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        return wrapSubqueriesInCypherCalls(context, nonCypherFields, [context.target]);
    }
    getCypherFieldsSubqueries(context) {
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        return wrapSubqueriesInCypherCalls(context, this.getCypherFields(), [context.target]);
    }
    getCypherFields() {
        return this.fields.filter((f) => f.isCypherField());
    }
    getProjectionMap(context) {
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        const projectionFields = this.fields.map((f) => f.getProjectionField(context.target));
        const sortProjectionFields = this.sortFields.map((f) => f.getProjectionField(context));
        const uniqueProjectionFields = Array.from(new Set([...projectionFields, ...sortProjectionFields])); // TODO remove duplicates with alias
        const stringFields = [];
        let otherFields = {};
        for (const field of uniqueProjectionFields) {
            if (typeof field === "string") {
                stringFields.push(field);
            }
            else {
                otherFields = { ...otherFields, ...field };
            }
        }
        return new Cypher.MapProjection(context.target, stringFields, otherFields);
    }
    addSortToClause(context, node, clause) {
        const isNested = Boolean(context.source); // This is to keep Cypher compatibility
        const orderByFields = this.sortFields.flatMap((f) => f.getSortFields(context, node, !isNested));
        const pagination = this.pagination ? this.pagination.getPagination() : undefined;
        clause.orderBy(...orderByFields);
        if (pagination?.skip) {
            clause.skip(pagination.skip);
        }
        if (pagination?.limit) {
            clause.limit(pagination.limit);
        }
    }
}
