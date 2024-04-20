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
import { Operation } from "../operations";
export class CompositeReadOperation extends Operation {
    constructor({ compositeEntity, children, relationship, }) {
        super();
        this.sortFields = [];
        this.entity = compositeEntity;
        this.children = children;
        this.relationship = relationship;
    }
    getChildren() {
        return this.children;
    }
    transpile(context) {
        const parentNode = context.target;
        const nestedSubqueries = this.children.flatMap((c) => {
            const result = c.transpile(context);
            let clauses = result.clauses;
            if (parentNode) {
                clauses = clauses.map((sq) => Cypher.concat(new Cypher.With("*"), sq));
            }
            return clauses;
        });
        let aggrExpr = Cypher.collect(context.returnVariable);
        if (!this.relationship) {
            aggrExpr = context.returnVariable;
        }
        if (this.relationship && !this.relationship.isList) {
            aggrExpr = Cypher.head(aggrExpr);
        }
        const nestedSubquery = new Cypher.Call(new Cypher.Union(...nestedSubqueries)).with(context.returnVariable);
        if (this.sortFields.length > 0) {
            nestedSubquery.orderBy(...this.getSortFields(context, context.returnVariable));
        }
        if (this.pagination) {
            const paginationField = this.pagination.getPagination();
            if (paginationField) {
                if (paginationField.skip) {
                    nestedSubquery.skip(paginationField.skip);
                }
                if (paginationField.limit) {
                    nestedSubquery.limit(paginationField.limit);
                }
            }
        }
        nestedSubquery.return([aggrExpr, context.returnVariable]);
        return {
            clauses: [nestedSubquery],
            projectionExpr: context.returnVariable,
        };
    }
    addPagination(pagination) {
        this.pagination = pagination;
    }
    addSort(...sortElement) {
        this.sortFields.push(...sortElement);
    }
    getSortFields(context, target) {
        return this.sortFields.flatMap((sf) => sf.getSortFields(context, target, false));
    }
}
