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
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import { createCypherAnnotationSubquery } from "../../../utils/create-cypher-subquery";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { CypherAttributeField } from "./CypherAttributeField";
import type { CypherUnionAttributePartial } from "./CypherUnionAttributePartial";

// Should Cypher be an operation?
export class CypherUnionAttributeField extends CypherAttributeField {
    protected unionPartials: CypherUnionAttributePartial[];

    constructor({
        alias,
        attribute,
        projection,
        unionPartials,
        rawArguments = {},
    }: {
        alias: string;
        attribute: AttributeAdapter;
        projection?: Record<string, string>;
        unionPartials: CypherUnionAttributePartial[];
        rawArguments: Record<string, any>;
    }) {
        super({ alias, attribute, projection, nestedFields: [], rawArguments });
        this.unionPartials = unionPartials;
    }

    public getChildren(): QueryASTNode[] {
        return [...super.getChildren(), ...(this.nestedFields || [])];
    }

    public getSubqueries(context: QueryASTContext): Cypher.Clause[] {
        const scope = context.getTargetScope();
        if (scope.has(this.attribute.name)) {
            throw new Error("Compile error, should execute attribute field before CypherPropertySort");
        }

        scope.set(this.attribute.name, this.customCypherVar);
        const subquery = createCypherAnnotationSubquery({
            context,
            attribute: this.attribute,
            projectionFields: this.projection,
            rawArguments: this.rawArguments,
            unionPartials: this.unionPartials,
        });

        return [subquery];
    }
}