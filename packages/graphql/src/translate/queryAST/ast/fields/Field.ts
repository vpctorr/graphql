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

import type Cypher from "@neo4j/cypher-builder";
import { QueryASTNode } from "../QueryASTNode";
import type { QueryASTVisitor } from "../../visitors/QueryASTVIsitor";
import type { CypherTreeSelection } from "../../../cypher-tree/Selection";
import type { CypherTreeProjectionField } from "../../../cypher-tree/ProjectionField";

interface ProjectionLike {
    addField(field: CypherTreeProjectionField);
}

export abstract class Field extends QueryASTNode {
    public alias: string;
    protected targetProjection?: ProjectionLike; // This could be just a Map | MapProjection

    constructor(alias: string) {
        super();
        this.alias = alias;
    }

    public toProjection(targetProjection: ProjectionLike): Field {
        // TODO: clone or something so it is not mutated
        this.targetProjection = targetProjection;
        return this;
    }

    protected addProjectionToTree(tree: CypherTreeSelection, field: CypherTreeProjectionField): void {
        if (this.targetProjection) {
            this.targetProjection.addField(field);
        } else tree.projection.addField(field);
    }

    public abstract getProjectionField(variable: Cypher.Variable): string | Record<string, Cypher.Expr>;
    public compileToCypher({ tree, target }: { tree: CypherTreeSelection; target: Cypher.Variable }): void {}

    public getSubquery(_node: Cypher.Node): Cypher.Clause[] | Cypher.Clause | undefined {
        return undefined;
    }

    public accept(v: QueryASTVisitor) {
        return v.visitField(this);
    }
}