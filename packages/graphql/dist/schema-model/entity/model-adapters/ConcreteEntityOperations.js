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
import { ImplementingEntityOperations } from "./ImplementingEntityOperations";
export class ConcreteEntityOperations extends ImplementingEntityOperations {
    constructor(concreteEntityAdapter) {
        super(concreteEntityAdapter);
    }
    get fullTextInputTypeName() {
        return `${this.entityAdapter.name}Fulltext`;
    }
    getFullTextIndexInputTypeName(indexName) {
        return `${this.entityAdapter.name}${upperFirst(indexName)}Fulltext`;
    }
    getFullTextIndexQueryFieldName(indexName) {
        return `${this.entityAdapter.plural}Fulltext${upperFirst(indexName)}`;
    }
    get relationshipsSubscriptionWhereInputTypeName() {
        return `${this.entityAdapter.name}RelationshipsSubscriptionWhere`;
    }
    get relationshipCreatedSubscriptionWhereInputTypeName() {
        return `${this.entityAdapter.name}RelationshipCreatedSubscriptionWhere`;
    }
    get relationshipDeletedSubscriptionWhereInputTypeName() {
        return `${this.entityAdapter.name}RelationshipDeletedSubscriptionWhere`;
    }
    // top-level connection type name
    get connectionFieldTypename() {
        return `${this.pascalCasePlural}Connection`;
    }
    // top-level connection edge type name, TODO: find a better name (this is coming from the RelationshipOperations)
    get relationshipFieldTypename() {
        return `${this.entityAdapter.name}Edge`;
    }
    get rootTypeFieldNames() {
        return {
            ...super.rootTypeFieldNames,
            subscribe: {
                created: `${this.entityAdapter.singular}Created`,
                updated: `${this.entityAdapter.singular}Updated`,
                deleted: `${this.entityAdapter.singular}Deleted`,
                relationship_deleted: `${this.entityAdapter.singular}RelationshipDeleted`,
                relationship_created: `${this.entityAdapter.singular}RelationshipCreated`,
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
}
