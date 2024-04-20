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
import { OperationField } from "../fields/OperationField";
import { CypherPropertySort } from "../sort/CypherPropertySort";
import { CypherScalarOperation } from "./CypherScalarOperation";
import { Operation } from "./operations";
export class ConnectionReadOperation extends Operation {
    constructor({ relationship, target, selection, }) {
        super();
        this.nodeFields = [];
        this.edgeFields = []; // TODO: merge with attachedTo?
        this.filters = [];
        this.sortFields = [];
        this.authFilters = [];
        this.relationship = relationship;
        this.target = target;
        this.selection = selection;
    }
    setNodeFields(fields) {
        this.nodeFields = fields;
    }
    addFilters(...filters) {
        this.filters.push(...filters);
    }
    setEdgeFields(fields) {
        this.edgeFields = fields;
    }
    addAuthFilters(...filter) {
        this.authFilters.push(...filter);
    }
    addSort(sortElement) {
        this.sortFields.push(sortElement);
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    getChildren() {
        const sortFields = this.sortFields.flatMap((s) => {
            return [...s.edge, ...s.node];
        });
        return filterTruthy([
            this.selection,
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.filters,
            ...this.authFilters,
            this.pagination,
            ...sortFields,
        ]);
    }
    transpile(context) {
        if (!context.target)
            throw new Error();
        // eslint-disable-next-line prefer-const
        let { selection: selectionClause, nestedContext } = this.selection.apply(context);
        let extraMatches = this.getChildren().flatMap((f) => {
            return f.getSelection(nestedContext);
        });
        if (extraMatches.length > 0) {
            extraMatches = [selectionClause, ...extraMatches];
            selectionClause = new Cypher.With("*");
        }
        const authFilterSubqueries = this.getAuthFilterSubqueries(nestedContext).map((sq) => {
            return new Cypher.Call(sq).importWith(nestedContext.target);
        });
        const normalFilterSubqueries = this.getFilterSubqueries(nestedContext).map((sq) => {
            return new Cypher.Call(sq).importWith(nestedContext.target);
        });
        const filtersSubqueries = [...authFilterSubqueries, ...normalFilterSubqueries];
        const edgesVar = new Cypher.NamedVariable("edges");
        const totalCount = new Cypher.NamedVariable("totalCount");
        const edgesProjectionVar = new Cypher.Variable();
        const unwindAndProjectionSubquery = this.createUnwindAndProjectionSubquery(nestedContext, edgesVar, edgesProjectionVar);
        let withWhere;
        if (filtersSubqueries.length > 0) {
            withWhere = new Cypher.With("*");
            this.addFiltersToClause(withWhere, nestedContext);
        }
        else {
            this.addFiltersToClause(selectionClause, nestedContext);
        }
        const nodeAndRelationshipMap = new Cypher.Map({
            node: nestedContext.target,
        });
        if (nestedContext.relationship) {
            nodeAndRelationshipMap.set("relationship", nestedContext.relationship);
        }
        const withCollectEdgesAndTotalCount = new Cypher.With([Cypher.collect(nodeAndRelationshipMap), edgesVar]).with(edgesVar, [Cypher.size(edgesVar), totalCount]);
        const returnClause = new Cypher.Return([
            new Cypher.Map({
                edges: edgesProjectionVar,
                totalCount: totalCount,
            }),
            context.returnVariable,
        ]);
        return {
            clauses: [
                Cypher.concat(...extraMatches, selectionClause, ...filtersSubqueries, withWhere, withCollectEdgesAndTotalCount, unwindAndProjectionSubquery, returnClause),
            ],
            projectionExpr: context.returnVariable,
        };
    }
    getAuthFilterSubqueries(context) {
        return this.authFilters.flatMap((f) => f.getSubqueries(context));
    }
    getFilterSubqueries(context) {
        return this.filters.flatMap((f) => f.getSubqueries(context));
    }
    getAuthFilterPredicate(context) {
        return filterTruthy(this.authFilters.map((f) => f.getPredicate(context)));
    }
    createUnwindAndProjectionSubquery(context, edgesVar, returnVar) {
        const edgeVar = new Cypher.NamedVariable("edge");
        const { prePaginationSubqueries, postPaginationSubqueries } = this.getPreAndPostSubqueries(context);
        let unwindClause;
        if (context.relationship) {
            unwindClause = new Cypher.Unwind([edgesVar, edgeVar]).with([edgeVar.property("node"), context.target], [edgeVar.property("relationship"), context.relationship]);
        }
        else {
            unwindClause = new Cypher.Unwind([edgesVar, edgeVar]).with([edgeVar.property("node"), context.target]);
        }
        const edgeProjectionMap = this.createProjectionMapForEdge(context);
        const paginationWith = this.generateSortAndPaginationClause(context);
        return new Cypher.Call(Cypher.concat(unwindClause, ...prePaginationSubqueries, paginationWith, ...postPaginationSubqueries, new Cypher.Return([Cypher.collect(edgeProjectionMap), returnVar]))).importWith(edgesVar);
    }
    createProjectionMapForEdge(context) {
        const nodeProjectionMap = this.generateProjectionMapForFields(this.nodeFields, context.target);
        if (nodeProjectionMap.size === 0) {
            nodeProjectionMap.set({
                __id: Cypher.id(context.target),
            });
        }
        nodeProjectionMap.set({
            __resolveType: new Cypher.Literal(this.target.name),
        });
        const edgeProjectionMap = new Cypher.Map();
        if (context.relationship) {
            const propertiesProjectionMap = this.generateProjectionMapForFields(this.edgeFields, context.relationship);
            if (propertiesProjectionMap.size) {
                if (this.relationship?.propertiesTypeName) {
                    // should be true if getting here but just in case..
                    propertiesProjectionMap.set("__resolveType", new Cypher.Literal(this.relationship.propertiesTypeName));
                }
                edgeProjectionMap.set("properties", propertiesProjectionMap);
            }
        }
        edgeProjectionMap.set("node", nodeProjectionMap);
        return edgeProjectionMap;
    }
    generateProjectionMapForFields(fields, target) {
        const projectionMap = new Cypher.Map();
        fields
            .map((f) => f.getProjectionField(target))
            .forEach((p) => {
            if (typeof p === "string") {
                projectionMap.set(p, target.property(p));
            }
            else {
                projectionMap.set(p);
            }
        });
        return projectionMap;
    }
    generateSortAndPaginationClause(context) {
        const shouldGenerateSortWith = this.pagination || this.sortFields.length > 0;
        if (!shouldGenerateSortWith) {
            return undefined;
        }
        const paginationWith = new Cypher.With("*");
        this.addPaginationSubclauses(paginationWith);
        this.addSortSubclause(paginationWith, context);
        return paginationWith;
    }
    addPaginationSubclauses(clause) {
        const paginationField = this.pagination && this.pagination.getPagination();
        if (paginationField?.limit) {
            clause.limit(paginationField.limit);
        }
        if (paginationField?.skip) {
            clause.skip(paginationField.skip);
        }
    }
    addSortSubclause(clause, context) {
        if (this.sortFields.length > 0) {
            const sortFields = this.getSortFields({
                context: context,
                nodeVar: context.target,
                edgeVar: context.relationship,
            });
            clause.orderBy(...sortFields);
        }
    }
    addFiltersToClause(clause, context) {
        const predicates = this.filters.map((f) => f.getPredicate(context));
        const authPredicate = this.getAuthFilterPredicate(context);
        const predicate = Cypher.and(...predicates, ...authPredicate);
        if (predicate) {
            clause.where(predicate);
        }
    }
    getSortFields({ context, nodeVar, edgeVar, }) {
        const aliasSort = true;
        return this.sortFields.flatMap(({ node, edge }) => {
            const nodeFields = node.flatMap((s) => s.getSortFields(context, nodeVar, aliasSort));
            if (edgeVar) {
                const edgeFields = edge.flatMap((s) => s.getSortFields(context, edgeVar, aliasSort));
                return [...nodeFields, ...edgeFields];
            }
            return nodeFields;
        });
    }
    /**
     *  This method resolves all the subqueries for each field and splits them into separate fields: `prePaginationSubqueries` and `postPaginationSubqueries`,
     *  in the `prePaginationSubqueries` are present all the subqueries required for the pagination purpose.
     **/
    getPreAndPostSubqueries(context) {
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        const sortNodeFields = this.sortFields.flatMap((sf) => sf.node);
        /**
         * cypherSortFieldsFlagMap is a Record<string, boolean> that holds the name of the sort field as key
         * and a boolean flag defined as true when the field is a `@cypher` field.
         **/
        const cypherSortFieldsFlagMap = sortNodeFields.reduce((sortFieldsFlagMap, sortField) => {
            if (sortField instanceof CypherPropertySort) {
                sortFieldsFlagMap[sortField.getFieldName()] = true;
            }
            return sortFieldsFlagMap;
        }, {});
        const preAndPostFields = this.nodeFields.reduce((acc, nodeField) => {
            if (nodeField instanceof OperationField &&
                nodeField.isCypherField() &&
                nodeField.operation instanceof CypherScalarOperation) {
                const cypherFieldName = nodeField.operation.cypherAttributeField.name;
                if (cypherSortFieldsFlagMap[cypherFieldName]) {
                    acc.Pre.push(nodeField);
                    return acc;
                }
            }
            acc.Post.push(nodeField);
            return acc;
        }, { Pre: [], Post: [] });
        const preNodeSubqueries = wrapSubqueriesInCypherCalls(context, preAndPostFields.Pre, [context.target]);
        const postNodeSubqueries = wrapSubqueriesInCypherCalls(context, preAndPostFields.Post, [context.target]);
        const sortSubqueries = wrapSubqueriesInCypherCalls(context, sortNodeFields, [context.target]);
        return {
            prePaginationSubqueries: [...sortSubqueries, ...preNodeSubqueries],
            postPaginationSubqueries: postNodeSubqueries,
        };
    }
}
