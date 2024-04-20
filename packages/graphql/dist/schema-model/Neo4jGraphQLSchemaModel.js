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
import { ConcreteEntityAdapter } from "./entity/model-adapters/ConcreteEntityAdapter";
/** Represents the internal model for the Neo4jGraphQL schema */
export class Neo4jGraphQLSchemaModel {
    constructor({ concreteEntities, compositeEntities, operations, annotations = {}, }) {
        this.entities = [...compositeEntities, ...concreteEntities].reduce((acc, entity) => {
            acc.set(entity.name, entity);
            return acc;
        }, new Map());
        this.concreteEntities = concreteEntities;
        this.compositeEntities = compositeEntities;
        this.operations = operations;
        this.annotations = annotations;
    }
    getEntity(name) {
        return this.entities.get(name);
    }
    getConcreteEntityAdapter(name) {
        const concreteEntity = this.concreteEntities.find((entity) => entity.name === name);
        return concreteEntity ? new ConcreteEntityAdapter(concreteEntity) : undefined;
    }
    getEntitiesByLabels(labels) {
        return this.concreteEntities.filter((entity) => entity.matchLabels(labels));
    }
    getEntitiesByNameAndLabels(name, labels) {
        return this.concreteEntities.filter((entity) => entity.name === name && entity.matchLabels(labels));
    }
}
