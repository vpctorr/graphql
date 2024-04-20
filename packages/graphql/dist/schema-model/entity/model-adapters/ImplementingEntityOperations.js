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
/** ImplementingType refers to the common abstraction of an ObjectType (ConcreteEntity) and InterfaceType */
export class ImplementingEntityOperations {
    constructor(entityAdapter) {
        this.entityAdapter = entityAdapter;
        this.pascalCasePlural = upperFirst(entityAdapter.plural);
        this.pascalCaseSingular = upperFirst(entityAdapter.singular);
    }
    get whereInputTypeName() {
        return `${this.entityAdapter.name}Where`;
    }
    get uniqueWhereInputTypeName() {
        return `${this.entityAdapter.name}UniqueWhere`;
    }
    get connectOrCreateWhereInputTypeName() {
        return `${this.entityAdapter.name}ConnectOrCreateWhere`;
    }
    get connectWhereInputTypeName() {
        return `${this.entityAdapter.name}ConnectWhere`;
    }
    get createInputTypeName() {
        return `${this.entityAdapter.name}CreateInput`;
    }
    get updateInputTypeName() {
        return `${this.entityAdapter.name}UpdateInput`;
    }
    get deleteInputTypeName() {
        return `${this.entityAdapter.name}DeleteInput`;
    }
    get optionsInputTypeName() {
        return `${this.entityAdapter.name}Options`;
    }
    get sortInputTypeName() {
        return `${this.entityAdapter.name}Sort`;
    }
    get relationInputTypeName() {
        return `${this.entityAdapter.name}RelationInput`;
    }
    get connectInputTypeName() {
        return `${this.entityAdapter.name}ConnectInput`;
    }
    get connectOrCreateInputTypeName() {
        return `${this.entityAdapter.name}ConnectOrCreateInput`;
    }
    get disconnectInputTypeName() {
        return `${this.entityAdapter.name}DisconnectInput`;
    }
    get onCreateInputTypeName() {
        return `${this.entityAdapter.name}OnCreateInput`;
    }
    get subscriptionWhereInputTypeName() {
        return `${this.entityAdapter.name}SubscriptionWhere`;
    }
    get subscriptionEventPayloadTypeName() {
        return `${this.entityAdapter.name}EventPayload`;
    }
    get implementationsSubscriptionWhereInputTypeName() {
        return `${this.entityAdapter.name}ImplementationsSubscriptionWhere`;
    }
    getAggregationFieldTypename() {
        return this.aggregateTypeNames.selection;
    }
    get rootTypeFieldNames() {
        return {
            connection: `${this.entityAdapter.plural}Connection`,
            create: `create${this.pascalCasePlural}`,
            read: this.entityAdapter.plural,
            update: `update${this.pascalCasePlural}`,
            delete: `delete${this.pascalCasePlural}`,
            aggregate: `${this.entityAdapter.plural}Aggregate`,
        };
    }
    get aggregateTypeNames() {
        return {
            selection: `${this.entityAdapter.name}AggregateSelection`,
            input: `${this.entityAdapter.name}AggregateSelectionInput`,
        };
    }
    get mutationResponseTypeNames() {
        return {
            create: `Create${this.pascalCasePlural}MutationResponse`,
            update: `Update${this.pascalCasePlural}MutationResponse`,
        };
    }
    get subscriptionEventTypeNames() {
        return {
            create: `${this.pascalCaseSingular}CreatedEvent`,
            update: `${this.pascalCaseSingular}UpdatedEvent`,
            delete: `${this.pascalCaseSingular}DeletedEvent`,
            create_relationship: `${this.pascalCaseSingular}RelationshipCreatedEvent`,
            delete_relationship: `${this.pascalCaseSingular}RelationshipDeletedEvent`,
        };
    }
    get subscriptionEventPayloadFieldNames() {
        return {
            create: `created${this.pascalCaseSingular}`,
            update: `updated${this.pascalCaseSingular}`,
            delete: `deleted${this.pascalCaseSingular}`,
            create_relationship: `${this.entityAdapter.singular}`,
            delete_relationship: `${this.entityAdapter.singular}`,
        };
    }
    get updateMutationArgumentNames() {
        return {
            connect: this.connectInputTypeName,
            disconnect: this.disconnectInputTypeName,
            create: this.relationInputTypeName,
            update: this.updateInputTypeName,
            delete: this.deleteInputTypeName,
            connectOrCreate: this.connectOrCreateInputTypeName,
            where: this.whereInputTypeName,
        };
    }
    get createMutationArgumentNames() {
        return {
            input: `[${this.createInputTypeName}!]!`,
        };
    }
    get connectOrCreateWhereInputFieldNames() {
        return {
            node: `${this.uniqueWhereInputTypeName}!`,
        };
    }
}
