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
import { Relationship } from "../classes";
import { ConcreteEntityAdapter } from "../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../schema-model/relationship/model-adapters/RelationshipAdapter";
/**
 * TODO [translation-layer-compatibility]
 * this file only contains old Relationship class construction
 * safe to delete when no longer needed
 */
export function createConnectionFields({ entityAdapter, relationshipFields, }) {
    const relationships = [];
    const entityRelationships = entityAdapter instanceof ConcreteEntityAdapter
        ? entityAdapter.relationships
        : entityAdapter.relationshipDeclarations;
    entityRelationships.forEach((relationship) => {
        const relFields = relationship instanceof RelationshipAdapter && relationship.propertiesTypeName
            ? relationshipFields.get(relationship.propertiesTypeName)
            : undefined;
        const r = new Relationship({
            name: relationship.operations.relationshipFieldTypename,
            type: relationship instanceof RelationshipAdapter ? relationship.type : undefined,
            source: relationship.source.name,
            target: relationship.target.name,
            properties: relationship instanceof RelationshipAdapter ? relationship.propertiesTypeName : undefined,
            ...(relFields
                ? {
                    temporalFields: relFields.temporalFields,
                    scalarFields: relFields.scalarFields,
                    primitiveFields: relFields.primitiveFields,
                    enumFields: relFields.enumFields,
                    pointFields: relFields.pointFields,
                    customResolverFields: relFields.customResolverFields,
                }
                : {}),
        });
        relationships.push(r);
    });
    return relationships;
}
