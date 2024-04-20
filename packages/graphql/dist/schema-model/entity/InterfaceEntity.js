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
export class InterfaceEntity {
    constructor({ name, description, concreteEntities, attributes = [], annotations = {}, relationshipDeclarations = [], }) {
        this.attributes = new Map();
        this.relationshipDeclarations = new Map();
        this.name = name;
        this.description = description;
        this.concreteEntities = concreteEntities;
        this.annotations = annotations;
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        for (const relationshipDeclaration of relationshipDeclarations) {
            this.addRelationshipDeclaration(relationshipDeclaration);
        }
    }
    isConcreteEntity() {
        return false;
    }
    isCompositeEntity() {
        return true;
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    addRelationshipDeclaration(relationshipDeclaration) {
        if (this.relationshipDeclarations.has(relationshipDeclaration.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${relationshipDeclaration.name} already exists in ${this.name}`);
        }
        this.relationshipDeclarations.set(relationshipDeclaration.name, relationshipDeclaration);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
}
