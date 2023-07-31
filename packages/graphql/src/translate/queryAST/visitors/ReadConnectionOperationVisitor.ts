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
import type { ConcreteEntity } from "../../../schema-model/entity/ConcreteEntity";
import { createNodeFromEntity, createRelationshipFromEntity } from "../utils/create-node-from-entity";
import type { OperationField } from "../ast/fields/OperationField";
import { getRelationshipDirection } from "../utils/get-relationship-direction";
import type { Filter } from "../ast/filters/Filter";
import { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import { ReadOperationVisitor } from "./ReadOperationVisitor";

type ReadConnectionOperationVisitorContructor = {
    parentNode?: Cypher.Node;
    connectionOperation: ConnectionReadOperation;
    isNested?: boolean;
    returnVariable: Cypher.Variable;
};

export class ReadConnectionOperationVisitor extends QueryASTVisitor {
    private nodeProjection: Cypher.Map;
    private edgeProjection: Cypher.Map;

    private targetNode: Cypher.Node;
    private predicates: Cypher.Predicate[] = [];

    private subqueries: Cypher.Clause[] = [];

    private pattern: Cypher.Pattern;
    private isNested: boolean;
    private returnVariable: Cypher.Variable;

    private connectionFieldAndFilterRewriterNode: ConnectionFieldAndFilterRewriter;
    private connectionFieldAndFilterRewriterEdge: ConnectionFieldAndFilterRewriter;

    constructor(opts: ReadConnectionOperationVisitorContructor) {
        super();

        this.isNested = Boolean(opts.isNested);
        this.returnVariable = opts.returnVariable;

        const relationship = opts.connectionOperation.relationship;

        if (!opts.parentNode) throw new Error("Parent node missing");
        this.targetNode = createNodeFromEntity(relationship.target as ConcreteEntity);
        const relVar = createRelationshipFromEntity(relationship);

        const relDirection = getRelationshipDirection(relationship, opts.connectionOperation.directed);

        this.pattern = new Cypher.Pattern(opts.parentNode)
            .withoutLabels()
            .related(relVar)
            .withDirection(relDirection)
            .to(this.targetNode);
        this.nodeProjection = new Cypher.Map();
        this.edgeProjection = new Cypher.Map();

        this.connectionFieldAndFilterRewriterNode = new ConnectionFieldAndFilterRewriter(
            this.targetNode,
            this.nodeProjection,
            this.predicates
        );
        this.connectionFieldAndFilterRewriterEdge = new ConnectionFieldAndFilterRewriter(
            relVar,
            this.edgeProjection,
            this.predicates
        );

        [...opts.connectionOperation.nodeFields, ...opts.connectionOperation.nodeFilters].forEach((n) =>
            n.accept(this.connectionFieldAndFilterRewriterNode)
        );
        [...opts.connectionOperation.edgeFields, ...opts.connectionOperation.edgeFilters].forEach((n) =>
            n.accept(this.connectionFieldAndFilterRewriterEdge)
        );

        if (this.nodeProjection.size === 0) {
            this.nodeProjection.set({
                __resolveType: new Cypher.Literal(relationship.target.name),
                __id: Cypher.id(this.targetNode),
            });
        }

        this.edgeProjection.set("node", this.nodeProjection);
    }

    public visitOperationField(operationField: OperationField) {
        const projectionVariable = new Cypher.Variable(); // Same as nested return variable

        this.edgeProjection.set({
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

    public build(): Cypher.Clause {
        const matchClause = new Cypher.Match(this.pattern).where(Cypher.and(...this.predicates));
        const subqueries = this.subqueries.map((sq) => new Cypher.Call(sq).innerWith(this.targetNode));

        const edge = new Cypher.NamedVariable("edge");
        const edges = new Cypher.NamedVariable("edges");
        const totalCount = new Cypher.NamedVariable("totalCount");

        let returnClause: Cypher.Clause;
        if (this.isNested) {
            returnClause = new Cypher.With([this.edgeProjection, edge])
                .with([Cypher.collect(edge), edges])
                .with(edges, [Cypher.size(edges), totalCount])
                .return([
                    new Cypher.Map({
                        edges,
                        totalCount,
                    }),
                    this.returnVariable,
                ]);
        } else {
            returnClause = new Cypher.Return([this.edgeProjection, this.returnVariable]);
        }

        return Cypher.concat(matchClause, ...subqueries, returnClause);
    }
}

export class ConnectionFieldAndFilterRewriter extends QueryASTVisitor {
    private target: Cypher.Node | Cypher.Relationship;
    private projectionMap: Cypher.Map;

    private predicates: Cypher.Predicate[];

    constructor(target: Cypher.Node | Cypher.Relationship, projectionMap: Cypher.Map, predicates: Cypher.Predicate[]) {
        super();
        this.target = target;
        this.projectionMap = projectionMap;
        this.predicates = predicates;
    }

    visitFilter(filter: Filter) {
        const pred = filter.getPredicate(this.target);
        if (pred) {
            this.predicates.push(pred);
        }
    }

    visitAttributeField(attributeField: AttributeField) {
        this.projectionMap.set(attributeField.getProjectionMap(this.target));
    }
}
