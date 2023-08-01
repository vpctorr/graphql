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
import type { AttributeField } from "../ast/fields/attribute-fields/AttributeField";
import { QueryASTVisitor } from "./QueryASTVisitor";
import type { ReadOperation } from "../ast/operations/ReadOperation";
import { ConcreteEntity } from "../../../schema-model/entity/ConcreteEntity";
import { createNodeFromEntity, createRelationshipFromEntity } from "../utils/create-node-from-entity";
import type { OperationField } from "../ast/fields/OperationField";
import { getRelationshipDirection } from "../utils/get-relationship-direction";
import type { Filter } from "../ast/filters/Filter";
import { OperationVisitor } from "./OperationVisitor";
import type { PropertySort } from "../ast/sort/PropertySort";
import type { SortField } from "../ast/sort/Sort";

type ReadOperationVisitorConstructor = {
    parentNode?: Cypher.Node;
    readOperation: ReadOperation;
    isNested?: boolean;
    returnVariable: Cypher.Variable;
};

export class ReadOperationVisitor extends QueryASTVisitor {
    private projectionAttributes: (string | Record<string, Cypher.Expr>)[] = [];
    private targetNode: Cypher.Node;
    private predicates: Cypher.Predicate[] = [];
    private subqueries: Cypher.Clause[] = [];
    private pattern: Cypher.Pattern;
    private isNested: boolean;
    private returnVariable: Cypher.Variable;
    private sortFields: SortField[] = [];

    constructor(opts: ReadOperationVisitorConstructor) {
        super();

        this.isNested = Boolean(opts.isNested);
        this.returnVariable = opts.returnVariable;

        const entity = opts.readOperation.entity;
        if (entity instanceof ConcreteEntity) {
            // TODO: nested
            this.targetNode = createNodeFromEntity(entity, "this");
            this.pattern = new Cypher.Pattern(this.targetNode);
            // this.targetNode = new Cypher.NamedNode("this");
        } else {
            if (!opts.parentNode) throw new Error("Parent node missing");
            this.targetNode = createNodeFromEntity(entity.target as ConcreteEntity);
            const relVar = createRelationshipFromEntity(entity);

            const relDirection = getRelationshipDirection(entity, opts.readOperation.directed);

            this.pattern = new Cypher.Pattern(opts.parentNode)
                .withoutLabels()
                .related(relVar)
                .withDirection(relDirection)
                .to(this.targetNode);
        }
    }

    public visitAttributeField(attributeField: AttributeField) {
        const projectionField = attributeField.getProjectionField(this.targetNode);
        this.projectionAttributes.push(projectionField);
    }

    public visitFilter(filter: Filter): void {
        const predicate = filter.getPredicate(this.targetNode);
        if (predicate) {
            this.predicates.push(predicate);
        }
    }

    public visitPropertySort(propertySort: PropertySort) {
        if (this.isNested) {
            this.sortFields.push(propertySort.getSortField(this.targetNode)); // change for nested
        } else {
            this.sortFields.push(propertySort.getSortField(this.targetNode));
        }
        const projectionField = propertySort.getProjectionField();
        this.projectionAttributes.push(projectionField);
    }

    public visitOperationField(operationField: OperationField) {
        const projectionVariable = new Cypher.Variable(); // Same as nested return variable

        this.projectionAttributes.push({
            [operationField.alias]: projectionVariable,
        });
        const operationVisitor = new OperationVisitor(this.targetNode, projectionVariable);
        operationField.children.forEach((c) => c.accept(operationVisitor));
        this.subqueries.push(operationVisitor.build());
    }

    public build(): Cypher.Clause {
        const matchClause = new Cypher.Match(this.pattern).where(Cypher.and(...this.predicates));
        const subqueries = this.subqueries.map((sq) => new Cypher.Call(sq).innerWith(this.targetNode));

        let returnClause: Cypher.Clause;
        const projection = new Cypher.MapProjection(this.targetNode);
        const projectionEntries = Array.from(new Set(this.projectionAttributes));
        projectionEntries.forEach((c) => projection.set(c));
        if (this.isNested) {
            const withClause = new Cypher.With([projection, this.targetNode]);
            returnClause = withClause.return([Cypher.collect(this.targetNode), this.returnVariable]);
            if (this.sortFields.length > 0) {
                withClause.orderBy(...this.sortFields);
            }
        } else {
            if (this.sortFields.length > 0) {
                returnClause = new Cypher.With("*").orderBy(...this.sortFields).return([projection, this.returnVariable]);
            } else {
                returnClause = new Cypher.Return([projection, this.returnVariable]);
            }
        }

        return Cypher.concat(matchClause, ...subqueries, returnClause);
    }
}
