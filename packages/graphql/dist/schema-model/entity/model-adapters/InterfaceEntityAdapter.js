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
import { upperFirst } from "../../../utils/upper-first";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { RelationshipDeclarationAdapter } from "../../relationship/model-adapters/RelationshipDeclarationAdapter";
import { getFromMap } from "../../utils/get-from-map";
import { plural, singular } from "../../utils/string-manipulation";
import { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import { InterfaceEntityOperations } from "./InterfaceEntityOperations";
export class InterfaceEntityAdapter {
    constructor(entity) {
        this.attributes = new Map();
        this.relationshipDeclarations = new Map();
        this.uniqueFieldsKeys = [];
        this.name = entity.name;
        this.concreteEntities = [];
        this.annotations = entity.annotations;
        this.initAttributes(entity.attributes);
        this.initRelationshipDeclarations(entity.relationshipDeclarations);
        this.initConcreteEntities(entity.concreteEntities);
    }
    get globalIdField() {
        return undefined;
    }
    get operations() {
        if (!this._operations) {
            return new InterfaceEntityOperations(this);
        }
        return this._operations;
    }
    get singular() {
        if (!this._singular) {
            this._singular = singular(this.name);
        }
        return this._singular;
    }
    get plural() {
        if (!this._plural) {
            if (this.annotations.plural) {
                this._plural = plural(this.annotations.plural.value);
            }
            else {
                this._plural = plural(this.name);
            }
        }
        return this._plural;
    }
    get upperFirstPlural() {
        return upperFirst(this.plural);
    }
    getImplementationToAliasMapWhereAliased(attribute) {
        const concreteLabelsToAttributeAlias = [];
        const attributeNameInInterface = attribute.databaseName;
        for (const concreteEntity of this.concreteEntities) {
            const attributeDatabaseName = concreteEntity.findAttribute(attributeNameInInterface)?.databaseName;
            if (attributeDatabaseName && attributeDatabaseName !== attributeNameInInterface) {
                concreteLabelsToAttributeAlias.push([concreteEntity.getLabels(), attributeDatabaseName]);
            }
        }
        return concreteLabelsToAttributeAlias;
    }
    get isReadable() {
        return this.annotations.query === undefined || this.annotations.query.read === true;
    }
    get isAggregable() {
        return this.annotations.query === undefined || this.annotations.query.aggregate === true;
    }
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get uniqueFields() {
        return this.uniqueFieldsKeys.map((key) => getFromMap(this.attributes, key));
    }
    get sortableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSortableField());
    }
    get whereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isWhereField());
    }
    get aggregationWhereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregationWhereField());
    }
    get aggregableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregableField());
    }
    get updateInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isUpdateInputField());
    }
    get subscriptionEventPayloadFields() {
        return Array.from(this.attributes.values()).filter((attribute) => {
            if (!attribute.isEventPayloadField()) {
                return false;
            }
            const attributeIsCustomResolvedInAnyImplementations = !!this.concreteEntities
                .map((e) => e.findAttribute(attribute.name))
                .find((attribute) => attribute?.isCustomResolvable());
            return !attributeIsCustomResolvedInAnyImplementations;
        });
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    findRelationshipDeclarations(name) {
        return this.relationshipDeclarations.get(name);
    }
    initConcreteEntities(entities) {
        for (const entity of entities) {
            const entityAdapter = new ConcreteEntityAdapter(entity);
            this.concreteEntities.push(entityAdapter);
        }
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
            if (attributeAdapter.isConstrainable() && attributeAdapter.isUnique()) {
                this.uniqueFieldsKeys.push(attribute.name);
            }
        }
    }
    initRelationshipDeclarations(relationshipDeclarations) {
        for (const [relationshipName, relationshipDeclaration] of relationshipDeclarations.entries()) {
            this.relationshipDeclarations.set(relationshipName, new RelationshipDeclarationAdapter(relationshipDeclaration, this));
        }
    }
}
