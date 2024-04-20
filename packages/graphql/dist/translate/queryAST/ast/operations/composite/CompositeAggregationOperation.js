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
import { filterTruthy } from "../../../../../utils/utils";
import { QueryASTContext } from "../../QueryASTContext";
import { Operation } from "../operations";
export class CompositeAggregationOperation extends Operation {
    constructor({ compositeEntity, children, directed = true, }) {
        super();
        this.fields = [];
        this.nodeFields = [];
        this.edgeFields = [];
        this.authFilters = [];
        this.filters = [];
        this.sortFields = [];
        this.addWith = true;
        this.aggregationProjectionMap = new Cypher.Map();
        this.nodeMap = new Cypher.Map();
        this.edgeMap = new Cypher.Map();
        this.entity = compositeEntity;
        this.children = children;
        this.directed = directed;
    }
    getChildren() {
        return filterTruthy([
            ...this.fields,
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.filters,
            ...this.sortFields,
            ...this.authFilters,
            this.pagination,
            ...this.children,
        ]);
    }
    getSortFields(context, target) {
        return this.sortFields.flatMap((sf) => sf.getSortFields(context, target, false));
    }
    transpile(context) {
        const parentNode = context.target;
        if (parentNode) {
            return this.transpileAggregationOperation(context);
        }
        else {
            const newContext = new QueryASTContext({
                target: new Cypher.Node(),
                neo4jGraphQLContext: context.neo4jGraphQLContext,
            });
            const result = this.transpileAggregationOperation(newContext, false);
            const subqueriesAggr = result.clauses.map((clause) => {
                return new Cypher.Call(clause);
            });
            return {
                clauses: subqueriesAggr,
                projectionExpr: result.projectionExpr,
            };
        }
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
    setNodeFields(fields) {
        this.nodeFields = fields;
    }
    setEdgeFields(fields) {
        this.edgeFields = fields;
    }
    getPredicates(queryASTContext) {
        const authPredicates = this.getAuthFilterPredicate(queryASTContext);
        return Cypher.and(...this.filters.map((f) => f.getPredicate(queryASTContext)), ...authPredicates);
    }
    getAuthFilterPredicate(context) {
        return filterTruthy(this.authFilters.map((f) => f.getPredicate(context)));
    }
    addSortToClause(context, node, clause) {
        const orderByFields = this.sortFields.flatMap((f) => f.getSortFields(context, node));
        const pagination = this.pagination ? this.pagination.getPagination() : undefined;
        clause.orderBy(...orderByFields);
        if (pagination?.skip) {
            clause.skip(pagination.skip);
        }
        if (pagination?.limit) {
            clause.limit(pagination.limit);
        }
    }
    getFieldProjectionClause(target, returnVariable, field) {
        return field.getAggregationProjection(target, returnVariable);
    }
    transpileAggregationOperation(context, addWith = true) {
        this.addWith = addWith;
        const fieldSubqueries = this.createSubqueries(this.fields, context, this.aggregationProjectionMap);
        const nodeFieldSubqueries = this.createSubqueries(this.nodeFields, context, this.nodeMap);
        const edgeFieldSubqueries = this.createSubqueries(this.edgeFields, context, this.edgeMap, new Cypher.NamedNode("edge"));
        if (this.nodeMap.size > 0) {
            this.aggregationProjectionMap.set("node", this.nodeMap);
        }
        if (this.edgeMap.size > 0) {
            this.aggregationProjectionMap.set("edge", this.edgeMap);
        }
        return {
            clauses: [...fieldSubqueries, ...nodeFieldSubqueries, ...edgeFieldSubqueries],
            projectionExpr: this.aggregationProjectionMap,
        };
    }
    createSubqueries(fields, context, projectionMap, target = new Cypher.NamedNode("node")) {
        return fields.map((field) => {
            const returnVariable = new Cypher.Node();
            const nestedContext = context.setReturn(returnVariable);
            const withClause = this.createWithClause(context);
            const nestedSubquery = this.createNestedSubquery(nestedContext, target);
            projectionMap.set(field.getProjectionField(nestedContext.returnVariable));
            return Cypher.concat(nestedSubquery, withClause, field.getAggregationProjection(target, nestedContext.returnVariable));
        });
    }
    createWithClause(context) {
        const node = new Cypher.NamedNode("node");
        const filterContext = new QueryASTContext({
            neo4jGraphQLContext: context.neo4jGraphQLContext,
            target: node,
        });
        const filterPredicates = this.getPredicates(filterContext);
        let withClause;
        if (filterPredicates) {
            withClause = new Cypher.With("*");
            withClause.where(filterPredicates);
        }
        return withClause;
    }
    createNestedSubquery(context, target) {
        const parentNode = context.target;
        const nestedSubqueries = this.children.flatMap((c) => {
            if (target.name === "edge") {
                c.setAttachedTo("relationship");
            }
            else {
                c.setAttachedTo("node");
            }
            let clauses = c.getSubqueries(context);
            if (parentNode && this.addWith) {
                clauses = clauses.map((sq) => Cypher.concat(new Cypher.With(parentNode), sq));
            }
            return clauses;
        });
        return new Cypher.Call(new Cypher.Union(...nestedSubqueries));
    }
}
