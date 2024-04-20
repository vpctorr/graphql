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
import camelcase from "camelcase";
import pluralize from "pluralize";
import { fromGlobalId, toGlobalId } from "../utils/global-ids";
import { upperFirst } from "../utils/upper-first";
import { GraphElement } from "./GraphElement";
import { leadingUnderscores } from "../utils/leading-underscore";
class Node extends GraphElement {
    constructor(input) {
        super(input);
        this.relationFields = input.relationFields;
        this.connectionFields = input.connectionFields;
        this.cypherFields = input.cypherFields;
        this.otherDirectives = input.otherDirectives;
        this.propagatedDirectives = input.propagatedDirectives;
        this.unionFields = input.unionFields;
        this.interfaceFields = input.interfaceFields;
        this.interfaces = input.interfaces;
        this.objectFields = input.objectFields;
        this.nodeDirective = input.nodeDirective;
        this.fulltextDirective = input.fulltextDirective;
        this.limit = input.limitDirective;
        this.isGlobalNode = input.isGlobalNode;
        this._idField = input.globalIdField;
        this._idFieldIsInt = input.globalIdFieldIsInt;
        this.singular = this.generateSingular();
        this.plural = this.generatePlural(input.plural);
    }
    // Fields you can set in a create or update mutation
    get mutableFields() {
        return [
            ...this.temporalFields,
            ...this.enumFields,
            ...this.objectFields,
            ...this.scalarFields,
            ...this.primitiveFields,
            ...this.interfaceFields,
            ...this.objectFields,
            ...this.unionFields,
            ...this.pointFields,
        ];
    }
    /** Fields you can apply auth allow and bind to */
    // Maybe we can remove this as they may not be used anymore in the new auth system
    get authableFields() {
        return [
            ...this.primitiveFields,
            ...this.scalarFields,
            ...this.enumFields,
            ...this.unionFields,
            ...this.objectFields,
            ...this.temporalFields,
            ...this.pointFields,
            ...this.cypherFields,
        ];
    }
    get constrainableFields() {
        return [
            ...this.primitiveFields,
            ...this.scalarFields,
            ...this.enumFields,
            ...this.temporalFields,
            ...this.pointFields,
        ];
    }
    get uniqueFields() {
        return this.constrainableFields.filter((field) => field.unique);
    }
    get pascalCaseSingular() {
        return upperFirst(this.singular);
    }
    get pascalCasePlural() {
        return upperFirst(this.plural);
    }
    get rootTypeFieldNames() {
        const pascalCasePlural = this.pascalCasePlural;
        return {
            create: `create${pascalCasePlural}`,
            read: this.plural,
            update: `update${pascalCasePlural}`,
            delete: `delete${pascalCasePlural}`,
            aggregate: `${this.plural}Aggregate`,
            subscribe: {
                created: `${this.singular}Created`,
                updated: `${this.singular}Updated`,
                deleted: `${this.singular}Deleted`,
                relationship_created: `${this.singular}RelationshipCreated`,
                relationship_deleted: `${this.singular}RelationshipDeleted`,
            },
        };
    }
    get fulltextTypeNames() {
        return {
            result: `${this.pascalCaseSingular}FulltextResult`,
            where: `${this.pascalCaseSingular}FulltextWhere`,
            sort: `${this.pascalCaseSingular}FulltextSort`,
        };
    }
    get aggregateTypeNames() {
        return {
            selection: `${this.name}AggregateSelection`,
            input: `${this.name}AggregateSelectionInput`,
        };
    }
    get mutationResponseTypeNames() {
        const pascalCasePlural = this.pascalCasePlural;
        return {
            create: `Create${pascalCasePlural}MutationResponse`,
            update: `Update${pascalCasePlural}MutationResponse`,
        };
    }
    get subscriptionEventTypeNames() {
        const pascalCaseSingular = this.pascalCaseSingular;
        return {
            create: `${pascalCaseSingular}CreatedEvent`,
            update: `${pascalCaseSingular}UpdatedEvent`,
            delete: `${pascalCaseSingular}DeletedEvent`,
            create_relationship: `${pascalCaseSingular}RelationshipCreatedEvent`,
            delete_relationship: `${pascalCaseSingular}RelationshipDeletedEvent`,
        };
    }
    get subscriptionEventPayloadFieldNames() {
        const pascalCaseSingular = this.pascalCaseSingular;
        return {
            create: `created${pascalCaseSingular}`,
            update: `updated${pascalCaseSingular}`,
            delete: `deleted${pascalCaseSingular}`,
            create_relationship: `${this.singular}`,
            delete_relationship: `${this.singular}`,
        };
    }
    getLabelString(context) {
        return this.nodeDirective?.getLabelsString(this.name, context) || `:${this.name}`;
    }
    /**
     * Returns the list containing labels mapped with the values contained in the Context.
     * Be careful when using this method, labels returned are unescaped.
     **/
    getLabels(context) {
        return this.nodeDirective?.getLabels(this.name, context) || [this.name];
    }
    getMainLabel() {
        return this.nodeDirective?.labels?.[0] || this.name;
    }
    getAllLabels() {
        return this.nodeDirective?.labels || [this.name];
    }
    getGlobalIdField() {
        if (!this.isGlobalNode || !this._idField) {
            throw new Error("The 'global' property needs to be set to true on an @id directive before accessing the unique node id field");
        }
        return this._idField;
    }
    toGlobalId(id) {
        const typeName = this.name;
        const field = this.getGlobalIdField();
        return toGlobalId({ typeName, field, id });
    }
    fromGlobalId(relayId) {
        return fromGlobalId(relayId, this._idFieldIsInt);
    }
    generateSingular() {
        const singular = camelcase(this.name);
        return `${leadingUnderscores(this.name)}${singular}`;
    }
    generatePlural(inputPlural) {
        const name = inputPlural || this.plural || this.name;
        const plural = inputPlural || this.plural ? camelcase(name) : pluralize(camelcase(name));
        return `${leadingUnderscores(name)}${plural}`;
    }
}
export default Node;
