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

import type { ConcreteEntity } from "../../../../schema-model/entity/ConcreteEntity";
import type { Relationship } from "../../../../schema-model/relationship/Relationship";
import { createNodeFromEntity } from "../../utils/create-node-from-entity";
import { getRelationshipDirection } from "../../utils/get-relationship-direction";
import type { Field } from "../fields/Field";
import type { Filter } from "../filters/Filter";
import Cypher from "@neo4j/cypher-builder";
import type { OperationTranspileOptions } from "./operations";
import { Operation } from "./operations";
import type { Pagination, PaginationField } from "../pagination/Pagination";
import type { QueryASTNode } from "../QueryASTNode";
import { filterTruthy } from "../../../../utils/utils";
import type { Sort, SortField } from "../sort/Sort";
import { CypherTreeSelection } from "../../../cypher-tree/Selection";
import { CypherTreeProjectionField, CypherTreeProjectionMapField } from "../../../cypher-tree/ProjectionField";
import { CypherTreeAssign } from "../../../cypher-tree/Assign";

export class ConnectionReadOperation extends Operation {
    public readonly relationship: Relationship;
    private directed: boolean;

    public nodeFields: Field[] = [];
    public edgeFields: Field[] = [];

    private nodeFilters: Filter[] = [];
    private edgeFilters: Filter[] = [];

    private pagination: Pagination | undefined;

    private sortFields: Array<{ node: Sort[]; edge: Sort[] }> = [];

    constructor({ relationship, directed }: { relationship: Relationship; directed: boolean }) {
        super();
        this.relationship = relationship;
        this.directed = directed;
    }

    public get children(): QueryASTNode[] {
        return filterTruthy([
            ...this.nodeFields,
            ...this.edgeFields,
            ...this.nodeFilters,
            ...this.edgeFilters,
            this.pagination,
            // ...(this.sortFields?.edge || []), // TODO: add sort fields
            // ...(this.sortFields?.node || []),
        ]);
    }

    public getCypherTree({
        parentNode,
        returnVariable,
    }: {
        parentNode?: Cypher.Variable;
        returnVariable: Cypher.Variable;
    }): CypherTreeSelection {
        if (!parentNode) throw new Error("No parent node found!");
        // const node = createNodeFromEntity(this.relationship.target as ConcreteEntity);
        const relationship = new Cypher.Relationship({ type: this.relationship.type });
        const relDirection = getRelationshipDirection(this.relationship, this.directed);
        const targetNode = createNodeFromEntity(this.relationship.target as ConcreteEntity);

        // new Cypher.Pattern(parentNode).withoutLabels().related(relationship).withDirection(relDirection).to(node)

        const pattern = new Cypher.Pattern(parentNode as Cypher.Node)
            .withoutLabels()
            .related(relationship)
            .withDirection(relDirection)
            .to(targetNode);

        const readSelection = new CypherTreeSelection({
            pattern,
            target: targetNode,
            alias: returnVariable,
        });

        this.edgeFilters.forEach((f) => f.compileToCypher({ tree: readSelection, target: relationship }));
        this.nodeFilters.forEach((f) => f.compileToCypher({ tree: readSelection, target: targetNode }));

        const nodeProjection = new CypherTreeProjectionMapField("node");
        const edgeVar = new Cypher.NamedVariable("edge");
        const assignEdge = new CypherTreeAssign(edgeVar);

        if (this.nodeFields.length > 0) {
            this.nodeFields.forEach((f) =>
                f.toProjection(nodeProjection).compileToCypher({ tree: readSelection, target: targetNode })
            );
        } else {
            nodeProjection.addField(
                new CypherTreeProjectionField("__resolveType", new Cypher.Literal(this.relationship.target.name))
            );
            nodeProjection.addField(new CypherTreeProjectionField("__id", Cypher.id(targetNode)));
        }
        this.edgeFields.forEach((f) =>
            f.toProjection(assignEdge).compileToCypher({ tree: readSelection, target: relationship })
        );

        assignEdge.addField(nodeProjection);

        readSelection.addAssignment(assignEdge);

        const edgesVar = new Cypher.NamedVariable("edges");
        readSelection.addAssignment(new CypherTreeAssign(edgesVar, Cypher.collect(edgeVar)));
        const totalCount = new Cypher.NamedVariable("totalCount");
        readSelection.addAssignment(new CypherTreeAssign(totalCount, Cypher.size(edgesVar)).withVars(edgesVar));

        readSelection.projection.setType("Map");

        readSelection.projection.addField(new CypherTreeProjectionField("edges", edgesVar));
        readSelection.projection.addField(new CypherTreeProjectionField("totalCount", totalCount));

        return readSelection;
    }

    public setNodeFields(fields: Field[]) {
        this.nodeFields = fields;
    }
    public setNodeFilters(filters: Filter[]) {
        this.nodeFilters = filters;
    }

    public setEdgeFilters(filters: Filter[]) {
        this.edgeFilters = filters;
    }

    public setEdgeFields(fields: Field[]) {
        this.edgeFields = fields;
    }

    public addSort(sortElement: { node: Sort[]; edge: Sort[] }): void {
        this.sortFields.push(sortElement);
    }

    public addPagination(pagination: Pagination): void {
        this.pagination = pagination;
    }

    public transpile({ returnVariable, parentNode }: OperationTranspileOptions): Cypher.Clause {
        if (!parentNode) throw new Error();
        const node = createNodeFromEntity(this.relationship.target as ConcreteEntity);
        const relationship = new Cypher.Relationship({ type: this.relationship.type });
        const relDirection = getRelationshipDirection(this.relationship, this.directed);

        const clause = new Cypher.Match(
            new Cypher.Pattern(parentNode).withoutLabels().related(relationship).withDirection(relDirection).to(node)
        );

        const filterPredicates = Cypher.and(...this.nodeFilters.map((f) => f.getPredicate(node)));
        const edgeFilterPredicates = Cypher.and(...this.edgeFilters.map((f) => (f as any).getPredicate(relationship))); // Any because of relationship predicates

        const nodeProjectionMap = new Cypher.Map();
        this.nodeFields
            .map((f) => f.getProjectionField(node))
            .forEach((p) => {
                if (typeof p === "string") {
                    nodeProjectionMap.set(p, node.property(p));
                } else {
                    nodeProjectionMap.set(p);
                }
            });

        if (nodeProjectionMap.size === 0) {
            const targetNodeName = this.relationship.target.name;
            nodeProjectionMap.set({
                __resolveType: new Cypher.Literal(targetNodeName),
                __id: Cypher.id(node),
            });
        }

        const edgeVar = new Cypher.NamedVariable("edge");
        const edgesVar = new Cypher.NamedVariable("edges");
        const totalCount = new Cypher.NamedVariable("totalCount");

        const edgeProjectionMap = new Cypher.Map();

        this.edgeFields
            .map((f) => f.getProjectionField(relationship))
            .forEach((p) => {
                if (typeof p === "string") {
                    edgeProjectionMap.set(p, relationship.property(p));
                } else {
                    edgeProjectionMap.set(p);
                }
            });

        edgeProjectionMap.set("node", nodeProjectionMap);
        if (edgeFilterPredicates) {
            clause.where(edgeFilterPredicates);
        }
        if (filterPredicates) {
            clause.where(filterPredicates);
        }

        let sortSubquery: Cypher.With | undefined;
        if (this.pagination || this.sortFields.length > 0) {
            const paginationField = this.pagination && this.pagination.getPagination();

            // if (paginationField) {
            sortSubquery = this.getPaginationSubquery(edgesVar, paginationField);
            sortSubquery.addColumns(totalCount);
            // }
        }

        let extraWithOrder: Cypher.Clause | undefined;
        if (this.sortFields.length > 0) {
            const sortFields = this.getSortFields(node, relationship);

            extraWithOrder = new Cypher.With(relationship, node).orderBy(...sortFields);
        }

        const projectionClauses = new Cypher.With([edgeProjectionMap, edgeVar])
            .with([Cypher.collect(edgeVar), edgesVar])
            .with(edgesVar, [Cypher.size(edgesVar), totalCount]);

        const returnClause = new Cypher.Return([
            new Cypher.Map({
                edges: edgesVar,
                totalCount: totalCount,
            }),
            returnVariable,
        ]);
        return Cypher.concat(clause, extraWithOrder, projectionClauses, sortSubquery, returnClause);
    }

    private getPaginationSubquery(
        edgesVar: Cypher.Variable,
        paginationField: PaginationField | undefined
    ): Cypher.With {
        const edgeVar = new Cypher.NamedVariable("edge");

        const subquery = new Cypher.Unwind([edgesVar, edgeVar]).with(edgeVar);
        if (this.sortFields.length > 0) {
            const sortFields = this.getSortFields(edgeVar.property("node"), edgeVar);
            subquery.orderBy(...sortFields);
        }
        if (paginationField && paginationField.limit) {
            subquery.limit(paginationField.limit as any);
        }

        const returnVar = new Cypher.Variable();
        subquery.return([Cypher.collect(edgeVar), returnVar]);

        return new Cypher.Call(subquery).innerWith(edgesVar).with([returnVar, edgesVar]);
    }

    private getSortFields(
        nodeVar: Cypher.Variable | Cypher.Property,
        edgeVar: Cypher.Variable | Cypher.Property
    ): SortField[] {
        return this.sortFields.flatMap(({ node, edge }) => {
            const nodeFields = node.flatMap((s) => s.getSortFields(nodeVar));
            const edgeFields = edge.flatMap((s) => s.getSortFields(edgeVar));

            return [...nodeFields, ...edgeFields];
        });
    }
}