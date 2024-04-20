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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Memoize } from "typescript-memoize";
import { RelationshipNestedOperationsOption } from "../../../constants";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { ListFiltersAdapter } from "../../attribute/model-adapters/ListFiltersAdapter";
import { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../entity/model-adapters/UnionEntityAdapter";
import { getEntityAdapter } from "../../utils/get-entity-adapter";
import { plural, singular } from "../../utils/string-manipulation";
import { RelationshipOperations } from "./RelationshipOperations";
export class RelationshipAdapter {
    constructor(relationship, sourceAdapter) {
        this.attributes = new Map();
        const { name, type, args, attributes = new Map(), source, target, direction, isList, queryDirection, nestedOperations, aggregate, isNullable, description, annotations, propertiesTypeName, firstDeclaredInTypeName, originalTarget, } = relationship;
        this.name = name;
        this.type = type;
        this.args = args;
        if (sourceAdapter) {
            this.source = sourceAdapter;
        }
        else {
            this.source = getEntityAdapter(source);
        }
        this.direction = direction;
        this.isList = isList;
        this.queryDirection = queryDirection;
        this.nestedOperations = new Set(nestedOperations);
        this.aggregate = aggregate;
        this.isNullable = isNullable;
        this.rawEntity = target;
        this.initAttributes(attributes);
        this.description = description;
        this.annotations = annotations;
        this.propertiesTypeName = propertiesTypeName;
        this.firstDeclaredInTypeName = firstDeclaredInTypeName;
        this.rawOriginalTargetEntity = originalTarget;
        if (relationship.getSiblings()) {
            this.siblings = relationship.getSiblings();
        }
    }
    get operations() {
        if (!this._operations) {
            return new RelationshipOperations(this);
        }
        return this._operations;
    }
    get listFiltersModel() {
        if (!this._listFiltersModel) {
            if (!this.isList) {
                return;
            }
            this._listFiltersModel = new ListFiltersAdapter(this);
        }
        return this._listFiltersModel;
    }
    get singular() {
        if (!this._singular) {
            this._singular = singular(this.name);
        }
        return this._singular;
    }
    get plural() {
        if (!this._plural) {
            this._plural = plural(this.name);
        }
        return this._plural;
    }
    initAttributes(attributes) {
        for (const [attributeName, attribute] of attributes.entries()) {
            const attributeAdapter = new AttributeAdapter(attribute);
            this.attributes.set(attributeName, attributeAdapter);
        }
    }
    findAttribute(name) {
        return this.attributes.get(name);
    }
    /**
     * translation-only
     *
     * @param directed the direction asked during the query, for instance "friends(directed: true)"
     * @returns the direction to use in the CypherBuilder
     **/
    getCypherDirection(directed) {
        switch (this.queryDirection) {
            case "DIRECTED_ONLY": {
                return this.cypherDirectionFromRelDirection();
            }
            case "UNDIRECTED_ONLY": {
                return "undirected";
            }
            case "DEFAULT_DIRECTED": {
                if (directed === false) {
                    return "undirected";
                }
                return this.cypherDirectionFromRelDirection();
            }
            case "DEFAULT_UNDIRECTED": {
                if (directed === true) {
                    return this.cypherDirectionFromRelDirection();
                }
                return "undirected";
            }
        }
    }
    cypherDirectionFromRelDirection() {
        return this.direction === "IN" ? "left" : "right";
    }
    // construct the target entity only when requested
    get target() {
        if (!this._target) {
            this._target = getEntityAdapter(this.rawEntity);
        }
        return this._target;
    }
    get originalTarget() {
        if (!this.rawOriginalTargetEntity) {
            return;
        }
        return getEntityAdapter(this.rawOriginalTargetEntity);
    }
    isReadable() {
        return this.annotations.selectable?.onRead !== false;
    }
    isFilterableByValue() {
        return this.annotations.filterable?.byValue !== false;
    }
    isFilterableByAggregate() {
        return this.annotations.filterable?.byAggregate !== false;
    }
    isAggregable() {
        return this.annotations.selectable?.onAggregate !== false;
    }
    isCreatable() {
        return this.annotations.settable?.onCreate !== false;
    }
    isUpdatable() {
        return this.annotations.settable?.onUpdate !== false;
    }
    shouldGenerateFieldInputType(ifUnionRelationshipTargetEntity) {
        let relationshipTarget = this.target;
        if (ifUnionRelationshipTargetEntity) {
            relationshipTarget = ifUnionRelationshipTargetEntity;
        }
        return (this.nestedOperations.has(RelationshipNestedOperationsOption.CONNECT) ||
            this.nestedOperations.has(RelationshipNestedOperationsOption.CREATE) ||
            // The connectOrCreate field is not generated if the related type does not have a unique field
            (this.nestedOperations.has(RelationshipNestedOperationsOption.CONNECT_OR_CREATE) &&
                relationshipTarget instanceof ConcreteEntityAdapter &&
                relationshipTarget.uniqueFields.length > 0));
    }
    shouldGenerateUpdateFieldInputType(ifUnionRelationshipTargetEntity) {
        const onlyConnectOrCreate = this.nestedOperations.size === 1 &&
            this.nestedOperations.has(RelationshipNestedOperationsOption.CONNECT_OR_CREATE);
        if (this.target instanceof InterfaceEntityAdapter) {
            return this.nestedOperations.size > 0 && !onlyConnectOrCreate;
        }
        if (this.target instanceof UnionEntityAdapter) {
            if (!ifUnionRelationshipTargetEntity) {
                throw new Error("Expected member entity");
            }
            const onlyConnectOrCreateAndNoUniqueFields = onlyConnectOrCreate && !ifUnionRelationshipTargetEntity.uniqueFields.length;
            return this.nestedOperations.size > 0 && !onlyConnectOrCreateAndNoUniqueFields;
        }
        const onlyConnectOrCreateAndNoUniqueFields = onlyConnectOrCreate && !this.target.uniqueFields.length;
        return this.nestedOperations.size > 0 && !onlyConnectOrCreateAndNoUniqueFields;
    }
    get hasNonNullCreateInputFields() {
        return this.createInputFields.some((property) => property.typeHelper.isRequired());
    }
    get hasCreateInputFields() {
        return this.createInputFields.length > 0;
    }
    get hasUpdateInputFields() {
        return this.updateInputFields.length > 0;
    }
    get hasAnyProperties() {
        return this.propertiesTypeName !== undefined;
    }
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
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
    get sortableFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSortableField());
    }
    get whereFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isWhereField());
    }
    get subscriptionConnectedRelationshipFields() {
        return Array.from(this.attributes.values()).filter((attribute) => attribute.isSubscriptionConnectedRelationshipField());
    }
}
__decorate([
    Memoize()
], RelationshipAdapter.prototype, "target", null);
__decorate([
    Memoize()
], RelationshipAdapter.prototype, "originalTarget", null);
