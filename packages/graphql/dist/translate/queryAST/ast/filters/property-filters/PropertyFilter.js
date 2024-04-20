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
import { createComparisonOperation } from "../../../utils/create-comparison-operator";
import { Filter } from "../Filter";
import { hasTarget } from "../../../utils/context-has-target";
import { InterfaceEntityAdapter } from "../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export class PropertyFilter extends Filter {
    constructor({ attribute, relationship, comparisonValue, operator, isNot, attachedTo, }) {
        super();
        this.attribute = attribute;
        this.relationship = relationship;
        this.comparisonValue = comparisonValue;
        this.operator = operator;
        this.isNot = isNot;
        this.attachedTo = attachedTo ?? "node";
    }
    getChildren() {
        return [];
    }
    print() {
        return `${super.print()} [${this.attribute.name}] <${this.isNot ? "NOT " : ""}${this.operator}>`;
    }
    getPredicate(queryASTContext) {
        const prop = this.getPropertyRefOrAliasesCase(queryASTContext);
        if (this.comparisonValue === null) {
            return this.getNullPredicate(prop);
        }
        const baseOperation = this.getOperation(prop);
        return this.wrapInNotIfNeeded(baseOperation);
    }
    getPropertyRefOrAliasesCase(queryASTContext) {
        const implementationsWithAlias = this.getAliasesToResolve();
        if (implementationsWithAlias) {
            return this.generateCaseForAliasedFields(queryASTContext, implementationsWithAlias);
        }
        return this.getPropertyRef(queryASTContext);
    }
    getAliasesToResolve() {
        if (!this.relationship || !(this.relationship.target instanceof InterfaceEntityAdapter)) {
            return;
        }
        const aliasedImplementationsMap = this.relationship.target.getImplementationToAliasMapWhereAliased(this.attribute);
        if (!aliasedImplementationsMap.length) {
            return;
        }
        return aliasedImplementationsMap;
    }
    generateCaseForAliasedFields(queryASTContext, concreteLabelsToAttributeAlias) {
        if (!hasTarget(queryASTContext))
            throw new Error("No parent node found!");
        const aliasesCase = new Cypher.Case();
        for (const [labels, databaseName] of concreteLabelsToAttributeAlias) {
            aliasesCase
                .when(queryASTContext.target.hasLabels(...labels))
                .then(queryASTContext.target.property(databaseName));
        }
        aliasesCase.else(queryASTContext.target.property(this.attribute.databaseName));
        return aliasesCase;
    }
    getPropertyRef(queryASTContext) {
        if (this.attachedTo === "node") {
            if (!hasTarget(queryASTContext))
                throw new Error("No parent node found!");
            return queryASTContext.target.property(this.attribute.databaseName);
        }
        else if (this.attachedTo === "relationship" && queryASTContext.relationship) {
            return queryASTContext.relationship.property(this.attribute.databaseName);
        }
        else {
            throw new Error("Transpilation error");
        }
    }
    /** Returns the operation for a given filter.
     * To be overridden by subclasses
     */
    getOperation(prop) {
        return this.createBaseOperation({
            operator: this.operator,
            property: prop,
            param: new Cypher.Param(this.comparisonValue),
        });
    }
    /** Returns the default operation for a given filter */
    createBaseOperation({ operator, property, param, }) {
        const coalesceProperty = this.coalesceValueIfNeeded(property);
        return createComparisonOperation({ operator, property: coalesceProperty, param });
    }
    coalesceValueIfNeeded(expr) {
        if (this.attribute.annotations.coalesce) {
            const value = this.attribute.annotations.coalesce.value;
            const literal = new Cypher.Literal(value);
            return Cypher.coalesce(expr, literal);
        }
        return expr;
    }
    getNullPredicate(propertyRef) {
        if (this.isNot) {
            return Cypher.isNotNull(propertyRef);
        }
        else {
            return Cypher.isNull(propertyRef);
        }
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot)
            return Cypher.not(predicate);
        else
            return predicate;
    }
}
