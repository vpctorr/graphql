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

import type { Field } from "../ast/fields/Field";
import type { Filter } from "../ast/filters/Filter";
import type { Operation } from "../ast/operations/operations";
import type { Pagination } from "../ast/pagination/Pagination";
import type { Sort } from "../ast/sort/Sort";
import type { ReadOperation } from "../ast/operations/ReadOperation";
import type { AttributeField } from "../ast/fields/attribute-fields/AttributeField";
import type { OperationField } from "../ast/fields/OperationField";
import type Cypher from "@neo4j/cypher-builder";
import type { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import type { PropertySort } from "../ast/sort/PropertySort";

export abstract class QueryASTVisitor {
    // public visit(node: QueryASTNode) {
    // node.accept(this);
    // node.children.forEach((s) => this.visit(s));
    // }

    public visitSort(_element: Sort) {
        console.log("visitSort");
        //throw new Error("Method not implemented.");
    }

    public visitPropertySort(_element: PropertySort) {
        console.log("visitPropertySort");
        //throw new Error("Method not implemented.");
    }

    public visitOperation(_element: Operation) {
        console.log("visitOperation");
        //throw new Error("Method not implemented.");
    }

    public visitReadOperation(_readOperation: ReadOperation): void {
        // const visitReadVisitor = new ReadOperationVisitor({});
        // readOperation.children.forEach((s) => visitReadVisitor.visit(s));
        // this.clause = visitReadVisitor.build();
    }

    public visitConnectionReadOperation(
        _readOperation: ConnectionReadOperation,
        _returnVariable?: Cypher.Variable
    ): void {
        // const visitReadVisitor = new ReadOperationVisitor({});
        // readOperation.children.forEach((s) => visitReadVisitor.visit(s));
        // this.clause = visitReadVisitor.build();
    }

    public visitPagination(_element: Pagination) {
        console.log("visitPagination");
        //throw new Error("Method not implemented.");
    }

    public visitFilter(_element: Filter) {
        console.log("visitFilter");
        //throw new Error("Method not implemented.");
    }

    public visitAttributeField(_element: AttributeField) {
        //throw new Error("Method not implemented.");
    }

    public visitOperationField(_element: OperationField) {
        //throw new Error("Method not implemented.");
    }

    public visitField(_element: Field) {
        console.log("visitField");
        //throw new Error("Method not implemented.");
    }
}
