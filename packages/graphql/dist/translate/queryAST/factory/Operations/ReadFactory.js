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
import { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { checkEntityAuthentication } from "../../../authorization/check-authentication";
import { ReadOperation } from "../../ast/operations/ReadOperation";
import { CompositeReadOperation } from "../../ast/operations/composite/CompositeReadOperation";
import { CompositeReadPartial } from "../../ast/operations/composite/CompositeReadPartial";
import { NodeSelection } from "../../ast/selection/NodeSelection";
import { RelationshipSelection } from "../../ast/selection/RelationshipSelection";
import { getConcreteEntities } from "../../utils/get-concrete-entities";
import { getConcreteWhere } from "../../utils/get-concrete-where";
import { isConcreteEntity } from "../../utils/is-concrete-entity";
export class ReadFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createReadOperation({ entityOrRel, resolveTree, context, varName, reference, }) {
        const entity = entityOrRel instanceof RelationshipAdapter ? entityOrRel.target : entityOrRel;
        const relationship = entityOrRel instanceof RelationshipAdapter ? entityOrRel : undefined;
        const resolveTreeWhere = this.queryASTFactory.operationsFactory.getWhereArgs(resolveTree, reference);
        if (isConcreteEntity(entity)) {
            checkEntityAuthentication({
                entity: entity.entity,
                targetOperations: ["READ"],
                context,
            });
            let selection;
            if (relationship) {
                selection = new RelationshipSelection({
                    relationship,
                    directed: Boolean(resolveTree.args?.directed ?? true),
                });
            }
            else {
                selection = new NodeSelection({
                    target: entity,
                    alias: varName,
                });
            }
            const operation = new ReadOperation({
                target: entity,
                relationship,
                selection,
            });
            return this.hydrateReadOperation({
                operation,
                entity,
                resolveTree,
                context,
                whereArgs: resolveTreeWhere,
            });
        }
        else {
            const concreteEntities = getConcreteEntities(entity, resolveTreeWhere);
            const concreteReadOperations = concreteEntities.map((concreteEntity) => {
                // Duplicate from normal read
                let selection;
                if (relationship) {
                    selection = new RelationshipSelection({
                        relationship,
                        directed: Boolean(resolveTree.args?.directed ?? true),
                        targetOverride: concreteEntity,
                    });
                }
                else {
                    selection = new NodeSelection({
                        target: concreteEntity,
                        alias: varName,
                    });
                }
                const readPartial = new CompositeReadPartial({
                    target: concreteEntity,
                    relationship,
                    selection,
                });
                const whereArgs = getConcreteWhere(entity, concreteEntity, resolveTreeWhere);
                return this.hydrateReadOperation({
                    operation: readPartial,
                    entity: concreteEntity,
                    resolveTree,
                    context,
                    whereArgs: whereArgs,
                    partialOf: entity,
                });
            });
            const compositeReadOp = new CompositeReadOperation({
                compositeEntity: entity,
                children: concreteReadOperations,
                relationship,
            });
            this.hydrateCompositeReadOperationWithPagination(entity, compositeReadOp, resolveTree, context);
            return compositeReadOp;
        }
    }
    hydrateReadOperation({ entity, operation, resolveTree, context, whereArgs, partialOf, }) {
        return this.queryASTFactory.operationsFactory.hydrateOperation({
            entity,
            operation,
            context,
            whereArgs,
            fieldsByTypeName: resolveTree.fieldsByTypeName,
            sortArgs: resolveTree.args.options || {},
            partialOf,
        });
    }
    hydrateCompositeReadOperationWithPagination(entity, operation, resolveTree, context) {
        const options = this.queryASTFactory.operationsFactory.getOptions(entity, (resolveTree.args.options ?? {}));
        if (options) {
            const sort = this.queryASTFactory.sortAndPaginationFactory.createSortFields(options, entity, context);
            operation.addSort(...sort);
            const pagination = this.queryASTFactory.sortAndPaginationFactory.createPagination(options);
            if (pagination) {
                operation.addPagination(pagination);
            }
        }
    }
}
