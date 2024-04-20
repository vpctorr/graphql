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
export const whereRegEx = /(?<prefix>\w*\.)?(?<fieldName>[_A-Za-z]\w*?)(?<isConnection>Connection)?(?<isAggregate>Aggregate)?(?:_(?<operator>NOT|NOT_IN|IN|NOT_INCLUDES|INCLUDES|MATCHES|NOT_CONTAINS|CONTAINS|NOT_STARTS_WITH|STARTS_WITH|NOT_ENDS_WITH|ENDS_WITH|LT|LTE|GT|GTE|DISTANCE|ALL|NONE|SINGLE|SOME))?$/;
export function parseWhereField(field) {
    const match = whereRegEx.exec(field);
    const matchGroups = match?.groups;
    let isNot = false;
    let operator = undefined;
    if (matchGroups.operator) {
        const notSplit = matchGroups.operator.split("NOT_");
        if (notSplit.length === 2) {
            isNot = true;
            operator = notSplit[1];
        }
        else if (matchGroups.operator === "NOT" || matchGroups.operator === "NONE") {
            isNot = true;
            if (matchGroups.operator === "NONE") {
                operator = notSplit[0];
            }
        }
        else {
            operator = notSplit[0];
        }
    }
    return {
        fieldName: matchGroups.fieldName,
        isAggregate: Boolean(matchGroups.isAggregate),
        operator,
        isNot,
        prefix: matchGroups.prefix,
        isConnection: Boolean(matchGroups.isConnection),
    };
}
export function parseConnectionWhereFields(key) {
    const splitKey = key.split("_NOT");
    const isNot = splitKey.length > 1;
    return {
        fieldName: splitKey[0],
        isNot,
    };
}
export const aggregationFieldRegEx = /(?<fieldName>[_A-Za-z]\w*?)(?:_(?<aggregationOperator>AVERAGE|MAX|MIN|SUM|SHORTEST|LONGEST))?(?:_LENGTH)?(?:_(?<logicalOperator>EQUAL|GT|GTE|LT|LTE))?$/;
export function parseAggregationWhereFields(field) {
    const match = aggregationFieldRegEx.exec(field);
    const matchGroups = match?.groups;
    return {
        fieldName: matchGroups.fieldName,
        aggregationOperator: matchGroups.aggregationOperator,
        logicalOperator: matchGroups.logicalOperator,
    };
}
