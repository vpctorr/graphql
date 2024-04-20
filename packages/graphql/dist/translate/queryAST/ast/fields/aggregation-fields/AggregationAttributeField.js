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
import { filterFields, renameFields } from "../../../../../utils/utils";
import { AggregationField } from "./AggregationField";
export class AggregationAttributeField extends AggregationField {
    constructor({ alias, attribute, aggregationProjection, }) {
        super(alias);
        this.attribute = attribute;
        this.aggregationProjection = aggregationProjection;
    }
    getChildren() {
        return [];
    }
    getProjectionField(variable) {
        return { [this.alias]: variable };
    }
    getAggregationExpr(target) {
        const variable = target.property(this.attribute.databaseName);
        return this.createAggregationExpr(variable);
    }
    getAggregationProjection(target, returnVar) {
        if (this.attribute.typeHelper.isString()) {
            const aggrProp = target.property(this.attribute.databaseName);
            const listVar = new Cypher.NamedVariable("list");
            const projection = new Cypher.Return([this.createAggregationExpr(listVar), returnVar]);
            return Cypher.concat(new Cypher.With(target)
                .orderBy([Cypher.size(aggrProp), "DESC"])
                .with([Cypher.collect(aggrProp), listVar]), projection);
        }
        return new Cypher.Return([this.getAggregationExpr(target), returnVar]);
    }
    createAggregationExpr(target) {
        if (this.attribute.typeHelper.isString()) {
            const listVar = new Cypher.NamedVariable("list");
            return new Cypher.Map(this.filterProjection({
                longest: Cypher.head(listVar),
                shortest: Cypher.last(listVar),
            }));
        }
        // NOTE: These are types that are treated as numeric by aggregation
        if (this.attribute.typeHelper.isNumeric()) {
            return new Cypher.Map(this.filterProjection({
                min: Cypher.min(target),
                max: Cypher.max(target),
                average: Cypher.avg(target),
                sum: Cypher.sum(target),
            }));
        }
        if (this.attribute.typeHelper.isDateTime()) {
            return new Cypher.Map(this.filterProjection({
                min: this.createDatetimeProjection(Cypher.min(target)),
                max: this.createDatetimeProjection(Cypher.max(target)),
            }));
        }
        if (this.attribute.typeHelper.isTemporal()) {
            return new Cypher.Map(this.filterProjection({
                min: Cypher.min(target),
                max: Cypher.max(target),
            }));
        }
        if (this.attribute.typeHelper.isID()) {
            return new Cypher.Map(this.filterProjection({
                shortest: Cypher.min(target),
                longest: Cypher.max(target),
            }));
        }
        throw new Error(`Invalid aggregation type ${this.attribute.type.name}`);
    }
    // Filters and apply aliases in the projection
    filterProjection(projectionFields) {
        const filteredFields = filterFields(projectionFields, Object.keys(this.aggregationProjection));
        return renameFields(filteredFields, this.aggregationProjection);
    }
    createDatetimeProjection(expr) {
        return Cypher.apoc.date.convertFormat(expr, "iso_zoned_date_time", "iso_offset_date_time");
    }
}
