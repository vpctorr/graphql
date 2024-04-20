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
import { AUTH_FORBIDDEN_ERROR } from "../../../../../constants";
import { Filter } from "../Filter";
export class AuthorizationFilters extends Filter {
    constructor({ validationFilters, whereFilters, conditionForEvaluation, }) {
        super();
        // Maybe we can merge these into a single array
        this.validationFilters = [];
        this.whereFilters = [];
        this.validationFilters = validationFilters;
        this.whereFilters = whereFilters;
        this.conditionForEvaluation = conditionForEvaluation;
    }
    getPredicate(context) {
        const validateInnerPredicate = Cypher.or(...this.validationFilters.map((f) => f.getPredicate(context)));
        const wherePredicate = Cypher.or(...this.whereFilters.map((f) => f.getPredicate(context)));
        let validatePredicate;
        if (validateInnerPredicate) {
            const predicate = this.conditionForEvaluation
                ? Cypher.and(this.conditionForEvaluation, Cypher.not(validateInnerPredicate))
                : Cypher.not(validateInnerPredicate);
            validatePredicate = Cypher.apoc.util.validatePredicate(predicate, AUTH_FORBIDDEN_ERROR);
        }
        return Cypher.and(wherePredicate, validatePredicate);
    }
    getSubqueries(context) {
        return [...this.validationFilters, ...this.whereFilters].flatMap((c) => c.getSubqueries(context));
    }
    getSelection(context) {
        return [...this.validationFilters, ...this.whereFilters].flatMap((c) => c.getSelection(context));
    }
    getChildren() {
        return [...this.validationFilters, ...this.whereFilters];
    }
}
