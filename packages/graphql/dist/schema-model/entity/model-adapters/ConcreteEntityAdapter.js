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
import { upperFirst } from "graphql-compose";
import { MutationOperations } from "../../../graphql/directives/mutation";
import { SubscriptionEvent } from "../../../graphql/directives/subscription";
import { toGlobalId } from "../../../utils/global-ids";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { RelationshipAdapter } from "../../relationship/model-adapters/RelationshipAdapter";
import { getFromMap } from "../../utils/get-from-map";
import { plural, singular } from "../../utils/string-manipulation";
import { ConcreteEntityOperations } from "./ConcreteEntityOperations";
export class ConcreteEntityAdapter {
    constructor(entity) {
        this.attributes = new Map();
        this.relationships = new Map();
        this.compositeEntities = [];
        // These keys allow to store the keys of the map in memory and avoid keep iterating over the map.
        this.mutableFieldsKeys = [];
        this.uniqueFieldsKeys = [];
        this.constrainableFieldsKeys = [];
        this.name = entity.name;
        this.description = entity.description;
        this.labels = entity.labels;
        this.annotations = entity.annotations;
        this.initAttributes(entity.attributes);
        this.initRelationships(entity.relationships);
        this.description = entity.description;
        this.compositeEntities = entity.compositeEntities;
        this.entity = entity;
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
            if (attributeAdapter.isMutable()) {
                this.mutableFieldsKeys.push(attribute.name);
            }
            if (attributeAdapter.isConstrainable()) {
                this.constrainableFieldsKeys.push(attribute.name);
                if (attributeAdapter.isUnique()) {
                    this.uniqueFieldsKeys.push(attribute.name);
                }
            }
            if (attributeAdapter.isGlobalIDAttribute()) {
                this._globalIdField = attributeAdapter;
            }
        }
    }
    initRelationships(relationships) {
        for (const [relationshipName, relationship] of relationships.entries()) {
            this.relationships.set(relationshipName, new RelationshipAdapter(relationship, this));
        }
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    get isReadable() {
        return this.annotations.query === undefined || this.annotations.query.read === true;
    }
    get isAggregable() {
        return this.annotations.query === undefined || this.annotations.query.aggregate === true;
    }
    get isCreatable() {
        return (this.annotations.mutation === undefined ||
            this.annotations.mutation.operations.has(MutationOperations.CREATE));
    }
    get isUpdatable() {
        return (this.annotations.mutation === undefined ||
            this.annotations.mutation.operations.has(MutationOperations.UPDATE));
    }
    get isDeletable() {
        return (this.annotations.mutation === undefined ||
            this.annotations.mutation.operations.has(MutationOperations.DELETE));
    }
    get isSubscribable() {
        return this.annotations.subscription === undefined || this.annotations.subscription.events?.size > 0;
    }
    get isSubscribableOnCreate() {
        return (this.annotations.subscription === undefined ||
            this.annotations.subscription.events.has(SubscriptionEvent.CREATED));
    }
    get isSubscribableOnUpdate() {
        return (this.annotations.subscription === undefined ||
            this.annotations.subscription.events.has(SubscriptionEvent.UPDATED));
    }
    get isSubscribableOnDelete() {
        return (this.annotations.subscription === undefined ||
            this.annotations.subscription.events.has(SubscriptionEvent.DELETED));
    }
    get isSubscribableOnRelationshipCreate() {
        return (this.annotations.subscription === undefined ||
            this.annotations.subscription.events.has(SubscriptionEvent.RELATIONSHIP_CREATED));
    }
    get isSubscribableOnRelationshipDelete() {
        return (this.annotations.subscription === undefined ||
            this.annotations.subscription.events.has(SubscriptionEvent.RELATIONSHIP_DELETED));
    }
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get mutableFields() {
        return this.mutableFieldsKeys.map((key) => getFromMap(this.attributes, key));
    }
    get uniqueFields() {
        return this.uniqueFieldsKeys.map((key) => getFromMap(this.attributes, key));
    }
    get constrainableFields() {
        return this.constrainableFieldsKeys.map((key) => getFromMap(this.attributes, key));
    }
    get relatedEntities() {
        if (!this._relatedEntities) {
            this._relatedEntities = [...this.relationships.values()].map((relationship) => relationship.target);
        }
        return this._relatedEntities;
    }
    get objectFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isObjectField());
    }
    get sortableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSortableField());
    }
    get whereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isWhereField());
    }
    get aggregableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregableField());
    }
    get aggregationWhereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isAggregationWhereField());
    }
    get createInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isCreateInputField());
    }
    get updateInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isUpdateInputField());
    }
    get arrayMethodFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isArrayMethodField());
    }
    get onCreateInputFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isOnCreateField());
    }
    get temporalFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.typeHelper.isTemporal());
    }
    get subscriptionEventPayloadFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isEventPayloadField());
    }
    findRelationship(name) {
        return this.relationships.get(name);
    }
    // TODO: identify usage of old Node.[getLabels | getLabelsString] and migrate them if needed
    getLabels() {
        return Array.from(this.labels);
    }
    getMainLabel() {
        return this.getLabels()[0];
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
    get operations() {
        if (!this._operations) {
            return new ConcreteEntityOperations(this);
        }
        return this._operations;
    }
    get globalIdField() {
        return this._globalIdField;
    }
    isGlobalNode() {
        return !!this._globalIdField;
    }
    toGlobalId(id) {
        if (!this.isGlobalNode()) {
            throw new Error(`Entity ${this.name} is not a global node`);
        }
        return toGlobalId({
            typeName: this.name,
            field: this.globalIdField.name,
            id,
        });
    }
}
