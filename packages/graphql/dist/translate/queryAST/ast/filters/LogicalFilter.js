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
import { filterTruthy } from "../../../../utils/utils";
import { Filter } from "./Filter";
export class LogicalFilter extends Filter {
    constructor({ operation, filters }) {
        super();
        this.operation = operation;
        this.children = filters;
    }
    getChildren() {
        return [...this.children];
    }
    print() {
        return `${super.print()} <${this.operation}>`;
    }
    getSubqueries(context) {
        return this.children.flatMap((c) => c.getSubqueries(context));
    }
    getSelection(context) {
        return this.getChildren().flatMap((c) => c.getSelection(context));
    }
    getPredicate(queryASTContext) {
        const predicates = filterTruthy(this.children.map((f) => f.getPredicate(queryASTContext)));
        switch (this.operation) {
            case "NOT": {
                if (predicates.length === 0)
                    return undefined;
                return Cypher.not(Cypher.and(...predicates));
            }
            case "AND": {
                return Cypher.and(...predicates);
            }
            case "OR": {
                return Cypher.or(...predicates);
            }
            case "XOR": {
                return Cypher.xor(...predicates);
            }
        }
    }
}
