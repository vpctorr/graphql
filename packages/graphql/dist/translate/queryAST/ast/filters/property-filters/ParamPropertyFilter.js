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
import { PropertyFilter } from "./PropertyFilter";
/** A property which comparison has already been parsed into a Param */
export class ParamPropertyFilter extends PropertyFilter {
    constructor(options) {
        super(options);
        this.comparisonValue = options.comparisonValue;
    }
    getPredicate(queryASTContext) {
        const predicate = super.getPredicate(queryASTContext);
        // NOTE: Should this check be a different Filter?
        return Cypher.and(Cypher.isNotNull(this.comparisonValue), predicate);
    }
    getOperation(prop) {
        const comparisonParam = this.comparisonValue;
        return this.createBaseOperation({
            operator: this.operator,
            property: prop,
            param: comparisonParam,
        });
    }
}
