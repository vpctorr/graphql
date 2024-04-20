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
import { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { filterTruthy } from "../../../../utils/utils";
import { createNodeFromEntity, createRelationshipFromEntity } from "../../utils/create-node-from-entity";
import { wrapSubqueriesInCypherCalls } from "../../utils/wrap-subquery-in-calls";
import { QueryASTContext } from "../QueryASTContext";
import { Operation } from "./operations";
// TODO: somewhat dupe of readOperation
export class AggregationOperation extends Operation {
    constructor({ entity, directed = true, selection, }) {
        super();
        this.fields = []; // Aggregation fields
        this.nodeFields = []; // Aggregation node fields
        this.edgeFields = []; // Aggregation node fields
        this.authFilters = [];
        this.aggregationProjectionMap = new Cypher.Map();
        this.filters = [];
        this.sortFields = [];
        this.entity = entity;
        this.directed = directed;
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
    getChildren() {
        return filterTruthy([
            ...this.fields,
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.filters,
            ...this.sortFields,
            ...this.authFilters,
            this.selection,
            this.pagination,
        ]);
    }
    setNodeFields(fields) {
        this.nodeFields = fields;
    }
    setEdgeFields(fields) {
        this.edgeFields = fields;
    }
    transpile(context) {
        if (!context.hasTarget()) {
            throw new Error("No parent node found!");
        }
        const clauses = this.transpileAggregation(context);
        const isTopLevel = !(this.entity instanceof RelationshipAdapter);
        if (isTopLevel) {
            const clausesSubqueries = clauses.flatMap((sq) => new Cypher.Call(sq));
            return {
                clauses: clausesSubqueries,
                projectionExpr: this.aggregationProjectionMap,
            };
        }
        else {
            return {
                clauses,
                projectionExpr: this.aggregationProjectionMap,
            };
        }
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
    getPattern(context) {
        if (!context.target) {
            throw new Error("Not Target");
        }
        if (context.relationship) {
            if (!context.direction || !context.source) {
                throw new Error("No valid relationship");
            }
            return new Cypher.Pattern(context.source)
                .withoutLabels()
                .related(context.relationship)
                .withDirection(context.direction)
                .to(context.target);
        }
        else {
            return new Cypher.Pattern(context.target);
        }
    }
    createContext(parentContext) {
        if (this.entity instanceof RelationshipAdapter) {
            const relVar = createRelationshipFromEntity(this.entity);
            const targetNode = createNodeFromEntity(this.entity.target, parentContext.neo4jGraphQLContext);
            const relDirection = this.entity.getCypherDirection(this.directed);
            return parentContext.push({ relationship: relVar, target: targetNode, direction: relDirection });
        }
        else {
            const targetNode = createNodeFromEntity(this.entity, parentContext.neo4jGraphQLContext);
            return new QueryASTContext({
                target: targetNode,
                neo4jGraphQLContext: parentContext.neo4jGraphQLContext,
            });
        }
    }
    transpileAggregation(context) {
        const operationContext = this.createContext(context);
        const pattern = this.getPattern(operationContext);
        const fieldSubqueries = this.fields.map((f) => {
            const returnVariable = new Cypher.Variable();
            this.aggregationProjectionMap.set(f.getProjectionField(returnVariable));
            return this.createSubquery(f, pattern, returnVariable, context);
        });
        const nodeMap = new Cypher.Map();
        const nodeFieldSubqueries = this.nodeFields.map((f) => {
            const returnVariable = new Cypher.Variable();
            nodeMap.set(f.getProjectionField(returnVariable));
            return this.createSubquery(f, pattern, returnVariable, context);
        });
        if (nodeMap.size > 0) {
            this.aggregationProjectionMap.set("node", nodeMap);
        }
        let edgeFieldSubqueries = [];
        if (operationContext.relationship) {
            const edgeMap = new Cypher.Map();
            edgeFieldSubqueries = this.edgeFields.map((f) => {
                const returnVariable = new Cypher.Variable();
                edgeMap.set(f.getProjectionField(returnVariable));
                return this.createSubquery(f, pattern, returnVariable, context, "edge");
            });
            if (edgeMap.size > 0) {
                this.aggregationProjectionMap.set("edge", edgeMap);
            }
        }
        return [...fieldSubqueries, ...nodeFieldSubqueries, ...edgeFieldSubqueries];
    }
    createSubquery(field, pattern, returnVariable, context, target = "node") {
        const { selection: matchClause, nestedContext } = this.selection.apply(context);
        let extraSelectionWith = undefined;
        const nestedSubqueries = wrapSubqueriesInCypherCalls(nestedContext, this.getChildren(), [nestedContext.target]);
        const targetVar = target === "edge" ? nestedContext.relationship : nestedContext.target;
        if (!targetVar)
            throw new Error("Edge not define in aggregations");
        const filterPredicates = this.getPredicates(nestedContext);
        const selectionClauses = this.getChildren().flatMap((c) => {
            return c.getSelection(nestedContext);
        });
        if (selectionClauses.length > 0 || nestedSubqueries.length > 0) {
            extraSelectionWith = new Cypher.With("*");
        }
        if (filterPredicates) {
            if (extraSelectionWith) {
                extraSelectionWith.where(filterPredicates);
            }
            else {
                matchClause.where(filterPredicates);
            }
        }
        const ret = this.getFieldProjectionClause(targetVar, returnVariable, field);
        let sortClause;
        if (this.sortFields.length > 0 || this.pagination) {
            sortClause = new Cypher.With("*");
            this.addSortToClause(nestedContext, targetVar, sortClause);
        }
        return Cypher.concat(matchClause, ...selectionClauses, ...nestedSubqueries, extraSelectionWith, sortClause, ret);
    }
}
