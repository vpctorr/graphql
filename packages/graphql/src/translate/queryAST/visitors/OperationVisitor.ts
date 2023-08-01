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
import { QueryASTVisitor } from "./QueryASTVisitor";
import type { ReadOperation } from "../ast/operations/ReadOperation";
import type { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import { ReadConnectionOperationVisitor } from "./ReadConnectionOperationVisitor";
import { ReadOperationVisitor } from "./ReadOperationVisitor";

export class OperationVisitor extends QueryASTVisitor {
    private clause: Cypher.Clause | undefined;
    private readonly parentNode: Cypher.Node;
    private readonly returnVariable: Cypher.Variable;

    constructor(parentNode: Cypher.Node, returnVariable: Cypher.Variable) {
        super();
        this.parentNode = parentNode;
        this.returnVariable = returnVariable;
    }

    public visitReadOperation(readOperation: ReadOperation): void {
        const nestedReadVisitor = new ReadOperationVisitor({
            parentNode: this.parentNode,
            readOperation,
            isNested: true,
            returnVariable: this.returnVariable,
        });

        readOperation.children.forEach((c) => c.accept(nestedReadVisitor));

        this.clause = nestedReadVisitor.build();
    }

    public visitConnectionReadOperation(connectionOperation: ConnectionReadOperation): void {
        const nestedReadVisitor = new ReadConnectionOperationVisitor({
            parentNode: this.parentNode,
            connectionOperation,
            isNested: true,
            returnVariable: this.returnVariable,
        });

        connectionOperation.children.forEach((c) => c.accept(nestedReadVisitor));

        this.clause = nestedReadVisitor.build();
    }

    public build(): Cypher.Clause {
        if (!this.clause) {
            throw new Error("Clause not built");
        }
        return this.clause;
    }
}
