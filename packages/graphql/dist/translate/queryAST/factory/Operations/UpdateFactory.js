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
import { UpdateOperation } from "../../ast/operations/UpdateOperation";
export class UpdateFactory {
    constructor(queryASTFactory) {
        this.queryASTFactory = queryASTFactory;
    }
    createUpdateOperation(entity, resolveTree, context) {
        const responseFields = Object.values(resolveTree.fieldsByTypeName[entity.operations.mutationResponseTypeNames.update] ?? {});
        const updateOp = new UpdateOperation({ target: entity });
        const projectionFields = responseFields
            .filter((f) => f.name === entity.plural)
            .map((field) => {
            const readOP = this.queryASTFactory.operationsFactory.createReadOperation({
                entityOrRel: entity,
                resolveTree: field,
                context,
            });
            return readOP;
        });
        updateOp.addProjectionOperations(projectionFields);
        return updateOp;
    }
}
