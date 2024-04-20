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
import { Filter } from "../Filter";
import Cypher from "@neo4j/cypher-builder";
import { createComparisonOperation } from "../../../utils/create-comparison-operator";
export class JWTFilter extends Filter {
    constructor({ operator, JWTClaim, comparisonValue, isNot, }) {
        super();
        this.operator = operator;
        this.JWTClaim = JWTClaim;
        this.comparisonValue = comparisonValue;
        this.isNot = isNot;
    }
    getChildren() {
        return [];
    }
    getPredicate(_context) {
        const operation = createComparisonOperation({
            operator: this.operator,
            property: this.JWTClaim,
            param: new Cypher.Param(this.comparisonValue),
        });
        const predicate = this.wrapInNotIfNeeded(operation);
        return Cypher.and(Cypher.isNotNull(this.JWTClaim), predicate);
    }
    print() {
        return `${super.print()} <${this.operator} ${this.comparisonValue}>`;
    }
    wrapInNotIfNeeded(predicate) {
        if (this.isNot) {
            return Cypher.not(predicate);
        }
        else {
            return predicate;
        }
    }
}
