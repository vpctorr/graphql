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
import type { ConcreteEntity } from "../../../schema-model/entity/ConcreteEntity";
import { createNodeFromEntity, createRelationshipFromEntity } from "../utils/create-node-from-entity";
import type { OperationField } from "../ast/fields/OperationField";
import { getRelationshipDirection } from "../utils/get-relationship-direction";
import type { Filter } from "../ast/filters/Filter";
import type { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import { OperationVisitor } from "./OperationVisitor";
import type { PropertySort } from "../ast/sort/PropertySort";
import type { SortField } from "../ast/sort/Sort";

type ReadConnectionOperationVisitorConstructor = {
    parentNode?: Cypher.Node;
    connectionOperation: ConnectionReadOperation;
    isNested?: boolean;
    returnVariable: Cypher.Variable;
};

export class ReadConnectionOperationVisitor extends QueryASTVisitor {
    private nodeProjection: Cypher.Map;
    private edgeProjection: Cypher.Map;

    private targetNode: Cypher.Node;
    private relVar: Cypher.Relationship;
    private predicates: Cypher.Predicate[] = [];

    private subqueries: Cypher.Clause[] = [];

    private pattern: Cypher.Pattern;
    private isNested: boolean;
    private returnVariable: Cypher.Variable;
    private sortFields: SortField[] = [];
    private subquerySortFields: SortField[] = [];

    private connectionFieldAndFilterRewriterNode: ConnectionFieldAndFilterRewriter;
    private connectionFieldAndFilterRewriterEdge: ConnectionFieldAndFilterRewriter;

    constructor(opts: ReadConnectionOperationVisitorConstructor) {
        super();

        this.isNested = Boolean(opts.isNested);
        this.returnVariable = opts.returnVariable;

        const relationship = opts.connectionOperation.relationship;

        if (!opts.parentNode) throw new Error("Parent node missing");
        this.targetNode = createNodeFromEntity(relationship.target as ConcreteEntity);
        this.relVar = createRelationshipFromEntity(relationship);

        const relDirection = getRelationshipDirection(relationship, opts.connectionOperation.directed);

        this.pattern = new Cypher.Pattern(opts.parentNode)
            .withoutLabels()
            .related(this.relVar)
            .withDirection(relDirection)
            .to(this.targetNode);
        this.nodeProjection = new Cypher.Map();
        this.edgeProjection = new Cypher.Map();

        this.sortFields = [];
        this.subquerySortFields = [];
        this.connectionFieldAndFilterRewriterNode = new ConnectionFieldAndFilterRewriter(
            this.targetNode,
            this.nodeProjection,
            this.predicates,
            this.sortFields,
            this.subquerySortFields
        );
        this.connectionFieldAndFilterRewriterEdge = new ConnectionFieldAndFilterRewriter(
            this.relVar,
            this.edgeProjection,
            this.predicates,
            this.sortFields,
            this.subquerySortFields
        );

        [...opts.connectionOperation.nodeFields, ...opts.connectionOperation.nodeFilters].forEach((n) =>
            n.accept(this.connectionFieldAndFilterRewriterNode)
        );
        [...opts.connectionOperation.edgeFields, ...opts.connectionOperation.edgeFilters].forEach((n) =>
            n.accept(this.connectionFieldAndFilterRewriterEdge)
        );

        opts.connectionOperation.sortFields.forEach((s) => {
            s.edge.forEach((e) => e.accept(this.connectionFieldAndFilterRewriterEdge));
            s.node.forEach((n) => n.accept(this.connectionFieldAndFilterRewriterNode));
        });

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

        this.nodeProjection.set({
            [operationField.alias]: projectionVariable,
        });
        const operationVisitor = new OperationVisitor(this.targetNode, projectionVariable);
        operationField.children.forEach((c) => c.accept(operationVisitor));
        this.subqueries.push(operationVisitor.build());
    }

    public build(): Cypher.Clause {
        const matchClause = new Cypher.Match(this.pattern).where(Cypher.and(...this.predicates));
        const subqueries = this.subqueries.map((sq) => new Cypher.Call(sq).innerWith(this.targetNode));

        const edge = new Cypher.NamedVariable("edge");
        const edges = new Cypher.NamedVariable("edges");
        const totalCount = new Cypher.NamedVariable("totalCount");

        let returnClause: Cypher.Clause;
        if (this.isNested) {
            const edgeProjection = new Cypher.With([this.edgeProjection, edge])
                .with([Cypher.collect(edge), edges])
                .with(edges, [Cypher.size(edges), totalCount]);
            if (this.subquerySortFields.length > 0) {
                const sortReturnVariable = new Cypher.Variable();
                const sortSubquery = new Cypher.Call(
                    new Cypher.Unwind([edges, edge])
                        .with(edge)
                        .orderBy(...this.subquerySortFields)
                        .return([Cypher.collect(edge), sortReturnVariable])
                )
                    .innerWith(edges)
                    .with([sortReturnVariable, edges], totalCount);
                returnClause = Cypher.concat(
                    edgeProjection,
                    sortSubquery,
                    new Cypher.Return([
                        new Cypher.Map({
                            edges,
                            totalCount,
                        }),
                        this.returnVariable,
                    ])
                );
            } else {
                returnClause = edgeProjection.return([
                    new Cypher.Map({
                        edges,
                        totalCount,
                    }),
                    this.returnVariable,
                ]);
            }
        } else {
            returnClause = new Cypher.Return([this.edgeProjection, this.returnVariable]);
        }
        let sortClause: Cypher.Clause | undefined;
        if (this.sortFields.length > 0) {
            sortClause = new Cypher.With(this.relVar, this.targetNode).orderBy(...this.sortFields);
        }

        return Cypher.concat(matchClause, sortClause, ...subqueries, returnClause);
    }
}

export class ConnectionFieldAndFilterRewriter extends QueryASTVisitor {
    private target: Cypher.Node | Cypher.Relationship;
    private projectionMap: Cypher.Map;

    private predicates: Cypher.Predicate[];
    private sortFields: SortField[];
    private subquerySortFields: SortField[];

    constructor(
        target: Cypher.Node | Cypher.Relationship,
        projectionMap: Cypher.Map,
        predicates: Cypher.Predicate[],
        sortFields: SortField[],
        subquerySortFields: SortField[]
    ) {
        super();
        this.target = target;
        this.projectionMap = projectionMap;
        this.predicates = predicates;
        this.sortFields = sortFields;
        this.subquerySortFields = subquerySortFields;
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

    public visitPropertySort(propertySort: PropertySort) {
        this.sortFields.push(propertySort.getSortField(this.target));
        if (this.target instanceof Cypher.Node) {
            this.subquerySortFields.push(propertySort.getSortField(new Cypher.NamedVariable("edge").property("node")));
        } else {
            this.subquerySortFields.push(propertySort.getSortField(new Cypher.NamedVariable("edge")));
        }
    }
}
