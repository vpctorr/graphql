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
import Cypher from "@neo4j/cypher-builder";
import { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { mapLabelsWithContext } from "../../../schema-model/utils/map-labels-with-context";
export function createNodeFromEntity(entity, neo4jGraphQLContext, name) {
    const nodeLabels = entity instanceof ConcreteEntityAdapter ? entity.getLabels() : [entity.name];
    const labels = neo4jGraphQLContext ? mapLabelsWithContext(nodeLabels, neo4jGraphQLContext) : nodeLabels;
    if (name) {
        return new Cypher.NamedNode(name, { labels });
    }
    return new Cypher.Node({
        labels,
    });
}
export function createRelationshipFromEntity(rel, name) {
    if (name) {
        return new Cypher.NamedRelationship(name, { type: rel.type });
    }
    return new Cypher.Relationship({
        type: rel.type,
    });
}
