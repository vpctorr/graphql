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
import type { Attribute } from "../../../../schema-model/attribute/Attribute";
import type { QueryASTNode } from "../QueryASTNode";
import type { QueryASTVisitor } from "../../visitors/QueryASTVisitor";
import type { SortField } from "./Sort";
import { Sort } from "./Sort";

export class PropertySort extends Sort {
    public attribute: Attribute;
    public direction: Cypher.Order;

    constructor({ attribute, direction }: { attribute: Attribute; direction: Cypher.Order }) {
        super();
        this.attribute = attribute;
        this.direction = direction;
    }

    public get children(): QueryASTNode[] {
        return [];
    }

    public accept(v: QueryASTVisitor): void {
        v.visitPropertySort(this);
    }

    public getSortField(variable: Cypher.Variable | Cypher.Property): SortField {
        const nodeProperty = variable.property(this.attribute.name); // getDBName?
        return [nodeProperty, this.direction];
    }

    public getProjectionField(): string | Record<string, Cypher.Expr> {
        return this.attribute.name;
    }
}
