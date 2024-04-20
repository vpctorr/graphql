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
import { Neo4jGraphQLSchemaValidationError } from "../../classes";
import { upperFirst } from "../../utils/upper-first";
// "CREATE" | "UPDATE" | "DELETE" | "CONNECT" | "DISCONNECT" | "CONNECT_OR_CREATE";
export class Relationship {
    constructor({ name, type, args, attributes = [], source, target, direction, isList, queryDirection, nestedOperations, aggregate, isNullable, description, annotations = {}, propertiesTypeName, firstDeclaredInTypeName, originalTarget, siblings, }) {
        this.attributes = new Map();
        this.type = type;
        this.source = source;
        this.target = target;
        this.name = name;
        this.args = args;
        this.direction = direction;
        this.isList = isList;
        this.queryDirection = queryDirection;
        this.nestedOperations = nestedOperations;
        this.aggregate = aggregate;
        this.isNullable = isNullable;
        this.description = description;
        this.annotations = annotations;
        this.propertiesTypeName = propertiesTypeName;
        this.firstDeclaredInTypeName = firstDeclaredInTypeName;
        this.originalTarget = originalTarget;
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        if (siblings) {
            this.setSiblings(siblings);
        }
    }
    clone() {
        return new Relationship({
            name: this.name,
            type: this.type,
            args: this.args,
            attributes: Array.from(this.attributes.values()).map((a) => a.clone()),
            source: this.source,
            target: this.target,
            direction: this.direction,
            isList: this.isList,
            queryDirection: this.queryDirection,
            nestedOperations: this.nestedOperations,
            aggregate: this.aggregate,
            isNullable: this.isNullable,
            description: this.description,
            annotations: this.annotations,
            propertiesTypeName: this.propertiesTypeName,
            firstDeclaredInTypeName: this.firstDeclaredInTypeName,
            originalTarget: this.originalTarget,
            siblings: this.siblings,
        });
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}.`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    setSiblings(siblingPropertiesTypeNames) {
        this.siblings = siblingPropertiesTypeNames;
    }
    getSiblings() {
        return this.siblings;
    }
    // TODO: Remove  connectionFieldTypename and relationshipFieldTypename and delegate to the adapter
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename() {
        return `${this.source.name}${upperFirst(this.name)}Connection`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename() {
        return `${this.source.name}${upperFirst(this.name)}Relationship`;
    }
}
