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
import { Field } from "../Field";
export class AttributeField extends Field {
    constructor({ alias, attribute }) {
        super(alias);
        this.attribute = attribute;
    }
    getChildren() {
        return [];
    }
    getFieldName() {
        return this.attribute.name;
    }
    getCypherExpr(target) {
        return target.property(this.attribute.databaseName);
    }
    getProjectionField(variable) {
        const variableProperty = variable.property(this.attribute.databaseName);
        return this.createAttributeProperty(variableProperty);
    }
    createAttributeProperty(variableProperty) {
        if (this.alias !== this.attribute.databaseName) {
            return { [this.alias]: variableProperty };
        }
        return this.attribute.databaseName;
    }
}
