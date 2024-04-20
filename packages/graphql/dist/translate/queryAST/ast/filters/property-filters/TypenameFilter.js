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
import { Filter } from "../Filter";
import { hasTarget } from "../../../utils/context-has-target";
export class TypenameFilter extends Filter {
    constructor(acceptedEntities) {
        super();
        this.acceptedEntities = acceptedEntities;
    }
    getChildren() {
        return [];
    }
    print() {
        const acceptedEntities = this.acceptedEntities.map((e) => e.name);
        return `${super.print()} [${acceptedEntities.join(", ")}]`;
    }
    getPredicate(queryASTContext) {
        if (!hasTarget(queryASTContext))
            throw new Error("No parent node found!");
        const labelPredicate = this.acceptedEntities.map((e) => {
            return queryASTContext.target.hasLabels(e.name);
        });
        return Cypher.or(...labelPredicate);
    }
}
