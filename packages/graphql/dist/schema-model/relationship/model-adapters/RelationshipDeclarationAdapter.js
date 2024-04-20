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
import { RelationshipNestedOperationsOption } from "../../../constants";
import { ListFiltersAdapter } from "../../attribute/model-adapters/ListFiltersAdapter";
import { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../entity/model-adapters/UnionEntityAdapter";
import { getEntityAdapter } from "../../utils/get-entity-adapter";
import { plural, singular } from "../../utils/string-manipulation";
import { RelationshipAdapter } from "./RelationshipAdapter";
import { RelationshipDeclarationOperations } from "./RelationshipDeclarationOperations";
export class RelationshipDeclarationAdapter {
    constructor(relationshipDeclaration, sourceAdapter) {
        const { name, args, source, target, isList, nestedOperations, aggregate, isNullable, description, annotations, firstDeclaredInTypeName, } = relationshipDeclaration;
        this.name = name;
        this.args = args;
        if (sourceAdapter) {
            this.source = sourceAdapter;
        }
        else {
            this.source = getEntityAdapter(source);
        }
        this.isList = isList;
        this.nestedOperations = new Set(nestedOperations);
        this.aggregate = aggregate;
        this.isNullable = isNullable;
        this.rawEntity = target;
        this.description = description;
        this.annotations = annotations;
        this.relationshipImplementations = relationshipDeclaration.relationshipImplementations.map((r) => new RelationshipAdapter(r));
        this.firstDeclaredInTypeName = firstDeclaredInTypeName;
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
    get operations() {
        if (!this._operations) {
            return new RelationshipDeclarationOperations(this);
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
            this._plural = plural(this.name);
        }
        return this._plural;
    }
    // construct the target entity only when requested
    get target() {
        if (!this._target) {
            this._target = getEntityAdapter(this.rawEntity);
        }
        return this._target;
    }
    get nonGeneratedProperties() {
        return this.relationshipImplementations.flatMap((impl) => Array.from(impl.attributes.values()).filter((attribute) => attribute.isNonGeneratedField()));
    }
    get hasNonNullNonGeneratedProperties() {
        return this.nonGeneratedProperties.some((property) => property.typeHelper.isRequired());
    }
    get hasAnyProperties() {
        return !!this.relationshipImplementations.find((relationshipImpl) => relationshipImpl.hasAnyProperties);
    }
    get hasCreateInputFields() {
        return !!this.relationshipImplementations.find((impl) => impl.hasCreateInputFields);
    }
    get hasUpdateInputFields() {
        return !!this.relationshipImplementations.find((impl) => impl.hasUpdateInputFields);
    }
    get hasNonNullCreateInputFields() {
        return !!this.relationshipImplementations.find((impl) => impl.hasNonNullCreateInputFields);
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
    findRelationshipImplementation(relationshipName) {
        return this.relationshipImplementations.find((impl) => impl.name === relationshipName);
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
}
