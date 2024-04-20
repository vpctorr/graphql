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
import { InterfaceEntityAdapter } from "../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { hasTarget } from "../../../utils/context-has-target";
import { createNodeFromEntity } from "../../../utils/create-node-from-entity";
import { Filter } from "../Filter";
export class AggregationFilter extends Filter {
    constructor(relationship) {
        super();
        this.filters = [];
        this.relationship = relationship;
    }
    addFilters(...filter) {
        this.filters.push(...filter);
    }
    getChildren() {
        return [...this.filters];
    }
    getSubqueries(context) {
        if (!hasTarget(context))
            throw new Error("No parent node found!");
        this.subqueryReturnVariable = new Cypher.Variable();
        const relatedEntity = this.relationship.target;
        let relatedNode;
        let labelsFilter;
        if (relatedEntity instanceof InterfaceEntityAdapter) {
            relatedNode = new Cypher.Node();
            const labelsForImplementations = relatedEntity.concreteEntities.map((e) => relatedNode.hasLabels(...e.getLabels()));
            labelsFilter = Cypher.or(...labelsForImplementations);
        }
        else {
            relatedNode = createNodeFromEntity(relatedEntity, context.neo4jGraphQLContext);
        }
        const relationshipTarget = new Cypher.Relationship({
            type: this.relationship.type,
        });
        const pattern = new Cypher.Pattern(context.target)
            .withoutLabels()
            .related(relationshipTarget)
            .withDirection(this.relationship.getCypherDirection())
            .to(relatedNode);
        const nestedContext = context.push({
            target: relatedNode,
            relationship: relationshipTarget,
        });
        const predicates = Cypher.and(...this.filters.map((f) => f.getPredicate(nestedContext)));
        const returnColumns = [];
        if (predicates) {
            returnColumns.push([predicates, this.subqueryReturnVariable]);
        }
        if (returnColumns.length === 0)
            return []; // Maybe throw?
        const subquery = labelsFilter
            ? new Cypher.Match(pattern).where(labelsFilter).return(...returnColumns)
            : new Cypher.Match(pattern).return(...returnColumns);
        return [subquery];
    }
    getPredicate(_queryASTContext) {
        // should this throw instead?
        if (!this.subqueryReturnVariable)
            return undefined;
        return Cypher.eq(this.subqueryReturnVariable, Cypher.true);
    }
}
