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
import { Neo4jGraphQLSchemaValidationError } from "../classes";
export class Operation {
    constructor({ name, attributes = [], userResolvedAttributes = [], annotations = {}, }) {
        //  only includes custom Cypher fields
        this.attributes = new Map();
        this.userResolvedAttributes = new Map();
        this.name = name;
        this.annotations = annotations;
        for (const attribute of attributes) {
            this.addAttribute(attribute);
        }
        for (const attribute of userResolvedAttributes) {
            this.addUserResolvedAttributes(attribute);
        }
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    findUserResolvedAttributes(name) {
        return this.userResolvedAttributes.get(name);
    }
    addAttribute(attribute) {
        if (this.attributes.has(attribute.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.attributes.set(attribute.name, attribute);
    }
    addUserResolvedAttributes(attribute) {
        if (this.userResolvedAttributes.has(attribute.name)) {
            throw new Neo4jGraphQLSchemaValidationError(`User Resolved Attribute ${attribute.name} already exists in ${this.name}`);
        }
        this.userResolvedAttributes.set(attribute.name, attribute);
    }
}
