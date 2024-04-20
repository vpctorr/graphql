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
import { setsAreEqual } from "../../utils/sets-are-equal";
export class ConcreteEntity {
    constructor({ name, description, labels, attributes = [], annotations = {}, relationships = [], compositeEntities = [], }) {
        this.attributes = new Map();
        this.relationships = new Map();
        this.compositeEntities = []; // The composite entities that this entity is a part of
        this.name = name;
        this.description = description;
        this.labels = new Set(labels);
        this.annotations = annotations;
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        for (const relationship of relationships) {
            this.addRelationship(relationship);
        }
        for (const entity of compositeEntities) {
            this.addCompositeEntities(entity);
        }
    }
    isConcreteEntity() {
        return true;
    }
    isCompositeEntity() {
        return false;
    }
    matchLabels(labels) {
        return setsAreEqual(new Set(labels), this.labels);
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    addRelationship(relationship) {
        if (this.relationships.has(relationship.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${relationship.name} already exists in ${this.name}`);
        }
        this.relationships.set(relationship.name, relationship);
    }
    addCompositeEntities(entity) {
        this.compositeEntities.push(entity);
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    findRelationship(name) {
        return this.relationships.get(name);
    }
}
