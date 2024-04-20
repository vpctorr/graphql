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
import { AttributeField } from "./AttributeField";
export class PointAttributeField extends AttributeField {
    constructor({ attribute, alias, crs }) {
        super({ alias, attribute });
        this.crs = crs;
    }
    getProjectionField(variable) {
        const pointProjection = this.createPointProjection(variable);
        return { [this.alias]: pointProjection };
    }
    getCypherExpr(target) {
        return this.createPointProjection(target);
    }
    createPointProjection(variable) {
        const pointProperty = variable.property(this.attribute.databaseName);
        const caseStatement = new Cypher.Case().when(Cypher.isNotNull(pointProperty));
        // Sadly need to select the whole point object due to the risk of height/z
        // being selected on a 2D point, to which the database will throw an error
        if (this.attribute.typeHelper.isList()) {
            const arrayProjection = this.createPointArrayProjection(pointProperty);
            return caseStatement.then(arrayProjection).else(Cypher.Null);
        }
        else {
            const pointProjection = this.createPointProjectionMap(pointProperty);
            return caseStatement.then(pointProjection).else(Cypher.Null);
        }
    }
    createPointArrayProjection(pointProperty) {
        const projectionVar = new Cypher.Variable();
        const projectionMap = this.createPointProjectionMap(projectionVar);
        return new Cypher.ListComprehension(projectionVar).in(pointProperty).map(projectionMap);
    }
    createPointProjectionMap(variable) {
        const projectionMap = new Cypher.Map();
        projectionMap.set({ point: variable });
        if (this.crs) {
            projectionMap.set({ crs: variable.property("crs") });
        }
        return projectionMap;
    }
}
