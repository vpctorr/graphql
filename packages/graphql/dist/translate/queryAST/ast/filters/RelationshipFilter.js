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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Cypher from "@neo4j/cypher-builder";
import { Memoize } from "typescript-memoize";
import { filterTruthy } from "../../../../utils/utils";
import { createNodeFromEntity } from "../../utils/create-node-from-entity";
import { wrapSubqueriesInCypherCalls } from "../../utils/wrap-subquery-in-calls";
import { Filter } from "./Filter";
export class RelationshipFilter extends Filter {
    constructor({ relationship, operator, isNot, target, }) {
        super();
        this.targetNodeFilters = [];
        /** Variable to be used if relationship need to get the count (i.e. 1-1 relationships) */
        this.countVariable = new Cypher.Variable();
        this.relationship = relationship;
        this.isNot = isNot;
        this.operator = operator;
        this.target = target;
        // Note: This is just to keep naming with previous Cypher, it is safe to remove
        this.countVariable = new Cypher.NamedVariable(`${this.relationship.name}Count`);
    }
    getChildren() {
        return this.targetNodeFilters;
    }
    addTargetNodeFilter(...filter) {
        this.targetNodeFilters.push(...filter);
    }
    print() {
        return `${super.print()} [${this.relationship.name}] <${this.isNot ? "NOT " : ""}${this.operator}>`;
    }
    getNestedContext(context) {
        const relatedEntity = this.target;
        const target = createNodeFromEntity(relatedEntity, context.neo4jGraphQLContext);
        const relationship = new Cypher.Relationship({
            type: this.relationship.type,
        });
        const nestedContext = context.push({
            target,
            relationship,
        });
        return nestedContext;
    }
    getNestedSelectionSubqueries(context) {
        const returnVars = [];
        const nestedSelection = filterTruthy(this.targetNodeFilters.map((f) => {
            if (!context.hasTarget()) {
                throw new Error("No parent node found!");
            }
            const selection = f.getSelection(context);
            if (selection.length === 0)
                return undefined;
            const pattern = new Cypher.Pattern(context.source)
                .withoutLabels()
                .related(context.relationship)
                .withoutVariable()
                .withDirection(this.relationship.getCypherDirection())
                .to(context.target);
            const relationshipMatch = new Cypher.Match(pattern);
            const countVar = new Cypher.Variable();
            returnVars.push(countVar);
            const predicate = f.getPredicate(context);
            const withClause = new Cypher.With("*");
            if (predicate)
                withClause.where(predicate);
            let returnCondition;
            if (!this.relationship.isList) {
                returnCondition = Cypher.eq(Cypher.count(context.target), new Cypher.Literal(1));
            }
            else {
                returnCondition = Cypher.gt(Cypher.count(context.target), new Cypher.Literal(0));
            }
            withClause.return([returnCondition, countVar]);
            return Cypher.concat(relationshipMatch, ...selection, withClause);
        }));
        const predicates = returnVars.map((v) => Cypher.eq(v, Cypher.true));
        this.subqueryPredicate = Cypher.and(...predicates);
        return nestedSelection;
    }
    getSubqueries(context) {
        // NOTE: not using getNestedContext because this should not be memoized in ALL operations
        const relatedEntity = this.target;
        const target = createNodeFromEntity(relatedEntity, context.neo4jGraphQLContext);
        const relationship = new Cypher.Relationship({
            type: this.relationship.type,
        });
        const nestedContext = context.push({
            target,
            relationship,
        });
        const subqueries = [];
        const nestedSubqueries = this.targetNodeFilters.flatMap((f) => f.getSubqueries(nestedContext));
        const nestedSelection = this.getNestedSelectionSubqueries(nestedContext);
        if (nestedSubqueries.length > 0) {
            subqueries.push(...this.getNestedSubqueries(nestedContext));
        }
        if (nestedSelection.length > 0) {
            subqueries.push(...nestedSelection);
        }
        return subqueries;
    }
    getNestedSubqueries(context) {
        const pattern = new Cypher.Pattern(context.source)
            .withoutLabels()
            .related(context.relationship)
            .withoutVariable()
            .withDirection(this.relationship.getCypherDirection())
            .to(context.target);
        switch (this.operator) {
            case "NONE":
            case "SOME":
            case "SINGLE": {
                if (!context.hasTarget()) {
                    throw new Error("No parent node found!");
                }
                const match = new Cypher.Match(pattern);
                const returnVar = new Cypher.Variable();
                const nestedSubqueries = wrapSubqueriesInCypherCalls(context, this.targetNodeFilters, [context.target]);
                const subqueriesFilters = this.targetNodeFilters.map((f) => f.getPredicate(context));
                const subqueriesPredicate = Cypher.and(...subqueriesFilters);
                // NOTE: NONE is SOME + isNot
                // TODO: move to wrapInNullIfNeeded in getPredicate
                const comparator = this.isNot ? Cypher.false : Cypher.true;
                this.subqueryPredicate = Cypher.eq(returnVar, comparator);
                const withAfterSubqueries = new Cypher.With("*");
                if (subqueriesPredicate) {
                    withAfterSubqueries.where(subqueriesPredicate);
                }
                const returnPredicate = this.getNestedSubqueryFilter(context.target);
                withAfterSubqueries.return([returnPredicate, returnVar]);
                return [Cypher.concat(match, ...nestedSubqueries, withAfterSubqueries)];
            }
            case "ALL": {
                const { clause: nestedSubqueries, returnVariables: truthyReturn } = this.getSubqueryForAllFilter(pattern, context, false);
                const { clause: nestedSubqueries2, returnVariables: falsyReturn } = this.getSubqueryForAllFilter(pattern, context, true);
                this.subqueryPredicate = Cypher.and(...falsyReturn.map((v) => Cypher.eq(v, Cypher.false)), ...truthyReturn.map((v) => Cypher.eq(v, Cypher.true)));
                return [nestedSubqueries, nestedSubqueries2];
            }
        }
    }
    getSubqueryForAllFilter(pattern, context, notPredicate) {
        const returnVariables = [];
        const match = new Cypher.Match(pattern);
        const subqueries = this.targetNodeFilters.map((f) => {
            if (!context.hasTarget()) {
                throw new Error("No parent node found!");
            }
            const returnVar = new Cypher.Variable();
            returnVariables.push(returnVar);
            const nestedSubqueries = f.getSubqueries(context).map((sq) => {
                return new Cypher.Call(sq).importWith(context.target);
            });
            let predicate = f.getPredicate(context);
            if (predicate && notPredicate) {
                predicate = Cypher.not(predicate);
            }
            const withClause = new Cypher.With("*");
            if (predicate) {
                withClause.where(predicate);
            }
            withClause.return([Cypher.gt(Cypher.count(context.target), new Cypher.Literal(0)), returnVar]); // THis variable needs to be used in predicate
            return Cypher.concat(...nestedSubqueries, withClause);
        });
        return { clause: Cypher.concat(match, ...subqueries), returnVariables };
    }
    getNestedSubqueryFilter(target) {
        switch (this.operator) {
            case "NONE":
            case "SOME":
                if (this.relationship.isList) {
                    return Cypher.gt(Cypher.count(target), new Cypher.Literal(0));
                }
                else {
                    return Cypher.eq(Cypher.count(target), new Cypher.Literal(1));
                }
            case "SINGLE":
                return Cypher.eq(Cypher.count(target), new Cypher.Literal(1));
            case "ALL":
                throw new Error("Not supported");
        }
    }
    shouldCreateOptionalMatch() {
        return !this.relationship.isList && !this.relationship.isNullable;
    }
    getSelection(queryASTContext) {
        if (this.shouldCreateOptionalMatch() && !this.subqueryPredicate) {
            const nestedContext = this.getNestedContext(queryASTContext);
            if (!nestedContext.hasTarget()) {
                throw new Error("No parent node found!");
            }
            const pattern = new Cypher.Pattern(nestedContext.source)
                .withoutLabels()
                .related(nestedContext.relationship)
                .withDirection(this.relationship.getCypherDirection())
                .withoutVariable()
                .to(nestedContext.target);
            return [
                new Cypher.OptionalMatch(pattern).with("*", [Cypher.count(nestedContext.target), this.countVariable]),
            ];
        }
        return [];
    }
    getPredicate(queryASTContext) {
        if (this.subqueryPredicate) {
            return this.subqueryPredicate;
        }
        const nestedContext = this.getNestedContext(queryASTContext);
        if (this.shouldCreateOptionalMatch()) {
            const predicates = this.targetNodeFilters.map((c) => c.getPredicate(nestedContext));
            const innerPredicate = Cypher.and(...predicates);
            return Cypher.and(Cypher.neq(this.countVariable, new Cypher.Literal(0)), innerPredicate);
        }
        const pattern = new Cypher.Pattern(nestedContext.source)
            .withoutLabels()
            .related(nestedContext.relationship)
            .withDirection(this.relationship.getCypherDirection())
            .withoutVariable()
            .to(nestedContext.target);
        const predicate = this.createRelationshipOperation(pattern, nestedContext);
        if (predicate) {
            return this.wrapInNotIfNeeded(predicate);
        }
    }
    getSingleRelationshipOperation({ pattern, queryASTContext, innerPredicate, }) {
        if (!queryASTContext.hasTarget()) {
            throw new Error("No parent node found!");
        }
        const patternComprehension = new Cypher.PatternComprehension(pattern, new Cypher.Literal(1)).where(innerPredicate);
        return Cypher.single(queryASTContext.target, patternComprehension, new Cypher.Literal(true));
    }
    createRelationshipOperation(pattern, queryASTContext) {
        const predicates = this.targetNodeFilters.map((c) => c.getPredicate(queryASTContext));
        const innerPredicate = Cypher.and(...predicates);
        switch (this.operator) {
            case "ALL": {
                if (!innerPredicate) {
                    return;
                }
                const match = new Cypher.Match(pattern).where(innerPredicate);
                const negativeMatch = new Cypher.Match(pattern).where(Cypher.not(innerPredicate));
                // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
                return Cypher.and(new Cypher.Exists(match), Cypher.not(new Cypher.Exists(negativeMatch)));
            }
            case "SINGLE": {
                if (!innerPredicate) {
                    return;
                }
                return this.getSingleRelationshipOperation({
                    pattern,
                    queryASTContext,
                    innerPredicate,
                });
            }
            case "NONE":
            case "SOME": {
                const match = new Cypher.Match(pattern);
                if (innerPredicate) {
                    if (!this.relationship.isList) {
                        return this.getSingleRelationshipOperation({
                            pattern,
                            queryASTContext,
                            innerPredicate,
                        });
                    }
                    return new Cypher.Exists(match.where(innerPredicate));
                }
                return new Cypher.Exists(match);
            }
        }
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot) {
            return Cypher.not(predicate);
        }
        return predicate;
    }
}
__decorate([
    Memoize()
], RelationshipFilter.prototype, "getNestedContext", null);
__decorate([
    Memoize()
], RelationshipFilter.prototype, "getNestedSelectionSubqueries", null);
