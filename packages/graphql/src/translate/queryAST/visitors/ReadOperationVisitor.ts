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
import { ReadOperation } from "../ast/operations/ReadOperation";
import { ConcreteEntity } from "../../../schema-model/entity/ConcreteEntity";
import { createNodeFromEntity, createRelationshipFromEntity } from "../utils/create-node-from-entity";
import type { OperationField } from "../ast/fields/OperationField";
import { getRelationshipDirection } from "../utils/get-relationship-direction";
import type { Filter } from "../ast/filters/Filter";
import { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import { ReadConnectionOperationVisitor } from "./ReadConnectionOperationVisitor";

type ReadOperationVisitorContructor = {
    parentNode?: Cypher.Node;
    readOperation: ReadOperation;
    isNested?: boolean;
    returnVariable: Cypher.Variable;
};

export class ReadOperationVisitor extends QueryASTVisitor {
    private projection: Cypher.MapProjection;
    private targetNode: Cypher.Node;
    private predicates: Cypher.Predicate[] = [];

    private subqueries: Cypher.Clause[] = [];

    private pattern: Cypher.Pattern;
    private isNested: boolean;
    private returnVariable: Cypher.Variable;

    constructor(opts: ReadOperationVisitorContructor) {
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
        this.projection = new Cypher.MapProjection(this.targetNode);
    }

    public visitAttributeField(attributeField: AttributeField) {
        const projectionField = attributeField.getProjectionField(this.targetNode);
        this.projection.set(projectionField);
    }

    public visitFilter(filter: Filter): void {
        const predicate = filter.getPredicate(this.targetNode);
        if (predicate) {
            this.predicates.push(predicate);
        }
    }

    public visitOperationField(operationField: OperationField) {
        const projectionVariable = new Cypher.Variable(); // Same as nested return variable

        this.projection.set({
            [operationField.alias]: projectionVariable,
        });

        operationField.children.forEach((c) => {
            if (c instanceof ReadOperation) {
                // This is a hack, should be a new visitor (probably)
                this.visitReadOperation(c, projectionVariable);
            } else if (c instanceof ConnectionReadOperation) {
                this.visitConnectionReadOperation(c, projectionVariable);
            } else {
                c.accept(this);
            }
        });
    }

    public visitReadOperation(readOperation: ReadOperation, returnVariable: Cypher.Variable): void {
        const nestedReadVisitor = new ReadOperationVisitor({
            parentNode: this.targetNode,
            readOperation,
            isNested: true,
            returnVariable,
        });

        readOperation.children.forEach((c) => c.accept(nestedReadVisitor));

        this.subqueries.push(nestedReadVisitor.build());
    }

    public visitConnectionReadOperation(
        connectionOperation: ConnectionReadOperation,
        returnVariable: Cypher.Variable
    ): void {
        const nestedReadVisitor = new ReadConnectionOperationVisitor({
            parentNode: this.targetNode,
            connectionOperation,
            isNested: true,
            returnVariable,
        });

        connectionOperation.children.forEach((c) => c.accept(nestedReadVisitor));

        this.subqueries.push(nestedReadVisitor.build());
    }

    public build(): Cypher.Clause {
        const matchClause = new Cypher.Match(this.pattern).where(Cypher.and(...this.predicates));
        const subqueries = this.subqueries.map((sq) => new Cypher.Call(sq).innerWith(this.targetNode));

        let returnClause: Cypher.Clause;
        if (this.isNested) {
            returnClause = new Cypher.With([this.projection, this.targetNode]).return([
                Cypher.collect(this.targetNode),
                this.returnVariable, // Same as projection variable
            ]);
        } else {
            returnClause = new Cypher.Return([this.projection, this.returnVariable]);
        }

        return Cypher.concat(matchClause, ...subqueries, returnClause);
    }
}
