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
import { SCORE_FIELD } from "../../../graphql/directives/fulltext";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { CypherScalarOperation } from "../ast/operations/CypherScalarOperation";
import { Pagination } from "../ast/pagination/Pagination";
import { CypherPropertySort } from "../ast/sort/CypherPropertySort";
import { FulltextScoreSort } from "../ast/sort/FulltextScoreSort";
import { PropertySort } from "../ast/sort/PropertySort";
import { isConcreteEntity } from "../utils/is-concrete-entity";
import { isRelationshipEntity } from "../utils/is-relationship-entity";
import { isUnionEntity } from "../utils/is-union-entity";
export class SortAndPaginationFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createSortFields(options, entity, context, scoreVariable) {
        return (options.sort || [])?.flatMap((s) => {
            return this.createPropertySort({ optionArg: s, entity, context, scoreVariable });
        });
    }
    createConnectionSortFields(options, entityOrRel, context) {
        if (isRelationshipEntity(entityOrRel)) {
            const nodeSortFields = this.createPropertySort({
                optionArg: options.node ?? {},
                entity: entityOrRel.target,
                context,
            });
            const edgeSortFields = this.createPropertySort({
                optionArg: options.edge || {},
                entity: entityOrRel,
                context,
            });
            return {
                edge: edgeSortFields,
                node: nodeSortFields,
            };
        }
        const nodeSortFields = this.createPropertySort({
            optionArg: options.node ?? {},
            entity: entityOrRel,
            context,
        });
        return {
            edge: [],
            node: nodeSortFields,
        };
    }
    createPagination(options) {
        if (options.limit || options.offset) {
            return new Pagination({
                skip: options.offset,
                limit: options.limit,
            });
        }
    }
    createPropertySort({ optionArg, entity, context, scoreVariable, }) {
        if (isUnionEntity(entity)) {
            return [];
        }
        if (entity instanceof RelationshipAdapter &&
            entity.propertiesTypeName &&
            Object.keys(optionArg).some((k) => (entity.siblings || []).includes(k))) {
            if (!optionArg[entity.propertiesTypeName]) {
                return [];
            }
            return this.createPropertySort({
                optionArg: optionArg[entity.propertiesTypeName],
                entity,
                context,
                scoreVariable,
            });
        }
        return Object.entries(optionArg).map(([fieldName, sortDir]) => {
            // TODO: fix conflict with a a "score" fieldname
            if (fieldName === SCORE_FIELD && scoreVariable) {
                return new FulltextScoreSort({
                    scoreVariable,
                    direction: sortDir,
                });
            }
            const attribute = entity.findAttribute(fieldName);
            if (!attribute) {
                throw new Error(`no filter attribute ${fieldName}`);
            }
            if (attribute.annotations.cypher && isConcreteEntity(entity)) {
                const cypherOperation = this.queryASTFactory.operationsFactory.createCustomCypherOperation({
                    context,
                    cypherAttributeField: attribute,
                });
                if (!(cypherOperation instanceof CypherScalarOperation)) {
                    throw new Error("Transpile error: sorting is supported only for scalar properties");
                }
                return new CypherPropertySort({
                    direction: sortDir,
                    attribute,
                    cypherOperation,
                });
            }
            return new PropertySort({
                direction: sortDir,
                attribute,
            });
        });
    }
}
