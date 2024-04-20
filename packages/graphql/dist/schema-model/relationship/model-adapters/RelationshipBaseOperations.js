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
import { isUnionEntity } from "../../../translate/queryAST/utils/is-union-entity";
export class RelationshipBaseOperations {
    constructor(relationship) {
        this.relationship = relationship;
    }
    get prefixForTypename() {
        return `${this.relationship.source.name}${upperFirst(this.relationship.name)}`;
    }
    get prefixForTypenameWithInheritance() {
        const prefix = this.relationship.firstDeclaredInTypeName || this.relationship.source.name;
        return `${prefix}${upperFirst(this.relationship.name)}`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    getAggregationFieldTypename(nestedField) {
        const nestedFieldStr = upperFirst(nestedField || "");
        const aggregationStr = nestedField ? "Aggregate" : "Aggregation";
        return `${this.relationship.source.name}${this.relationship.target.name}${upperFirst(this.relationship.name)}${nestedFieldStr}${aggregationStr}Selection`;
    }
    getTargetTypePrettyName() {
        if (this.relationship.isList) {
            return `[${this.relationship.target.name}!]${!this.relationship.isNullable ? "!" : ""}`;
        }
        return `${this.relationship.target.name}${!this.relationship.isNullable ? "!" : ""}`;
    }
    getFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity?.name || ""}FieldInput`;
    }
    getConnectionUnionWhereInputTypename(concreteEntityAdapter) {
        return `${this.prefixForTypenameWithInheritance}${concreteEntityAdapter.name}ConnectionWhere`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename() {
        return `${this.prefixForTypenameWithInheritance}Connection`;
    }
    get connectionSortInputTypename() {
        return `${this.connectionFieldTypename}Sort`;
    }
    get connectionWhereInputTypename() {
        return `${this.connectionFieldTypename}Where`;
    }
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename() {
        return `${this.prefixForTypenameWithInheritance}Relationship`;
    }
    getUpdateFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity?.name || ""}UpdateFieldInput`;
    }
    getCreateFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity?.name || ""}CreateFieldInput`;
    }
    getDeleteFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${upperFirst(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}DeleteFieldInput`;
    }
    getConnectFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity?.name || ""}ConnectFieldInput`;
    }
    getDisconnectFieldInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.fieldInputPrefixForTypename}${upperFirst(this.relationship.name)}${ifUnionRelationshipTargetEntity?.name || ""}DisconnectFieldInput`;
    }
    getConnectOrCreateInputTypeName() {
        return `${this.prefixForTypename}ConnectOrCreateInput`;
    }
    getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter) {
        if (isUnionEntity(this.relationship.target)) {
            if (!concreteTargetEntityAdapter) {
                throw new Error("missing concreteTargetEntityAdapter");
            }
            return `${this.prefixForTypename}${concreteTargetEntityAdapter.name}ConnectOrCreateFieldInput`;
        }
        return `${this.prefixForTypename}ConnectOrCreateFieldInput`;
    }
    getConnectOrCreateOnCreateFieldInputTypeName(concreteTargetEntityAdapter) {
        return `${this.getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter)}OnCreate`;
    }
    get connectionFieldName() {
        return `${this.relationship.name}Connection`;
    }
    getConnectionWhereTypename(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypenameWithInheritance}${ifUnionRelationshipTargetEntity?.name || ""}ConnectionWhere`;
    }
    getUpdateConnectionInputTypename(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity?.name || ""}UpdateConnectionInput`;
    }
    get aggregateInputTypeName() {
        return `${this.prefixForTypename}AggregateInput`;
    }
    get aggregateTypeName() {
        return `${this.relationship.name}Aggregate`;
    }
    get nodeAggregationWhereInputTypeName() {
        return `${this.prefixForTypename}NodeAggregationWhereInput`;
    }
    get unionConnectInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}ConnectInput`;
    }
    get unionDeleteInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}DeleteInput`;
    }
    get unionDisconnectInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}DisconnectInput`;
    }
    get unionCreateInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}CreateInput`;
    }
    get unionCreateFieldInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}CreateFieldInput`;
    }
    get unionUpdateInputTypeName() {
        return `${upperFirst(this.prefixForTypename)}UpdateInput`;
    }
    getToUnionUpdateInputTypeName(ifUnionRelationshipTargetEntity) {
        return `${this.prefixForTypename}${ifUnionRelationshipTargetEntity.name}UpdateInput`;
    }
    get edgeCreateInputTypeName() {
        const isRequired = this.relationship.hasNonNullCreateInputFields;
        return `${this.edgePrefix}CreateInput${isRequired ? `!` : ""}`;
    }
    get createInputTypeName() {
        return `${this.edgePrefix}CreateInput`;
    }
    get edgeUpdateInputTypeName() {
        return `${this.edgePrefix}UpdateInput`;
    }
    get whereInputTypeName() {
        return `${this.edgePrefix}Where`;
    }
    get sortInputTypeName() {
        return `${this.edgePrefix}Sort`;
    }
    get edgeAggregationWhereInputTypeName() {
        return `${this.edgePrefix}AggregationWhereInput`;
    }
    getConnectOrCreateInputFields(target) {
        // TODO: use this._target in the end; currently passed-in as argument because unions need this per refNode
        return {
            where: `${target.operations.connectOrCreateWhereInputTypeName}!`,
            onCreate: `${this.getConnectOrCreateOnCreateFieldInputTypeName(target)}!`,
        };
    }
}
