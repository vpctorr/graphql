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

import type { AuthOperations, Context, GraphQLWhereArg } from "../types";
import type { Relationship, Node } from "../classes";
import { createAuthAndParams } from "./create-auth-and-params";
import Cypher from "@neo4j/cypher-builder";
import { createWherePredicate } from "./where/create-where-predicate";
import { SCORE_FIELD } from "../graphql/directives/fulltext";
import { whereRegEx, WhereRegexGroups } from "./where/utils";
import { createBaseOperation } from "./where/property-operations/create-comparison-operation";
import { RawCypher } from "@neo4j/cypher-builder";

export function translateTopLevelMatch({
    matchNode,
    node,
    context,
    operation,
}: {
    matchNode: Cypher.Node;
    context: Context;
    node: Node;
    operation: AuthOperations;
}): Cypher.CypherResult {
    const matchQuery = createMatchClause({ matchNode, node, context, operation });

    const result = matchQuery.build();
    return result;
}

export function createMatchClause({
    matchNode,
    node,
    context,
    operation,
}: {
    matchNode: Cypher.Node;
    context: Context;
    node: Node;
    operation: AuthOperations;
}): Cypher.Match | Cypher.db.FullTextQueryNodes {
    const { resolveTree } = context;
    const fulltextInput = (resolveTree.args.fulltext || {}) as Record<string, { phrase: string }>;
    let matchQuery: Cypher.Match<Cypher.Node> | Cypher.db.FullTextQueryNodes;
    let whereInput = resolveTree.args.where as GraphQLWhereArg | undefined;

    // TODO: removed deprecated fulltext translation
    if (Object.entries(fulltextInput).length) {
        if (Object.entries(fulltextInput).length > 1) {
            throw new Error("Can only call one search at any given time");
        }
        const [indexName, indexInput] = Object.entries(fulltextInput)[0];
        const phraseParam = new Cypher.Param(indexInput.phrase);

        matchQuery = new Cypher.db.FullTextQueryNodes(matchNode, indexName, phraseParam);

        const labelsChecks = node.getLabels(context).map((label) => {
            return Cypher.in(new Cypher.Literal(label), Cypher.labels(matchNode));
        });

        const andChecks = Cypher.and(...labelsChecks);
        if (andChecks) matchQuery.where(andChecks);
    } else if (context.fulltextIndex) {
        matchQuery = createFulltextMatchClause(matchNode, whereInput, node, context);
        whereInput = whereInput?.[node.singular];
    } else {
        matchQuery = new Cypher.Match(matchNode);
    }

    preComputedWhereFields(whereInput, node, context, matchNode);
    if (whereInput) {
        const whereOp = createWherePredicate({
            targetElement: matchNode,
            whereInput,
            context,
            element: node,
        });

        if (whereOp) matchQuery.where(whereOp);
    }

    const whereAuth = createAuthAndParams({
        operations: operation,
        entity: node,
        context,
        where: { varName: matchNode, node },
    });
    if (whereAuth[0]) {
        const authQuery = new Cypher.RawCypher(() => {
            return whereAuth;
        });

        matchQuery.where(authQuery);
    }

    return matchQuery;
}

function createFulltextMatchClause(
    matchNode: Cypher.Node,
    whereInput: GraphQLWhereArg | undefined,
    node: Node,
    context: Context
): Cypher.db.FullTextQueryNodes {
    // TODO: remove indexName assignment and undefined check once the name argument has been removed.
    const indexName = context.fulltextIndex.indexName || context.fulltextIndex.name;
    if (indexName === undefined) {
        throw new Error("The name of the fulltext index should be defined using the indexName argument.");
    }
    const phraseParam = new Cypher.Param(context.resolveTree.args.phrase);
    const scoreVar = context.fulltextIndex.scoreVariable;

    const matchQuery = new Cypher.db.FullTextQueryNodes(matchNode, indexName, phraseParam, scoreVar);

    const expectedLabels = node.getLabels(context);
    const labelsChecks = matchNode.hasLabels(...expectedLabels);

    if (whereInput?.[SCORE_FIELD]) {
        if (whereInput[SCORE_FIELD].min || whereInput[SCORE_FIELD].min === 0) {
            const scoreMinOp = Cypher.gte(scoreVar, new Cypher.Param(whereInput[SCORE_FIELD].min));
            if (scoreMinOp) matchQuery.where(scoreMinOp);
        }
        if (whereInput[SCORE_FIELD].max || whereInput[SCORE_FIELD].max === 0) {
            const scoreMaxOp = Cypher.lte(scoreVar, new Cypher.Param(whereInput[SCORE_FIELD].max));
            if (scoreMaxOp) matchQuery.where(scoreMaxOp);
        }
    }

    if (labelsChecks) matchQuery.where(labelsChecks);

    return matchQuery;
}

function preComputedWhereFields(whereInput: any, node: Node, context: Context, matchNode: Cypher.Node) {
    /*     const cyphers: string[] = [];
    const inStr = field.direction === "IN" ? "<-" : "-";
    const outStr = field.direction === "OUT" ? "->" : "-";
    const nodeVariable = `${chainStr}_node`;
    const edgeVariable = `${chainStr}_edge`;
    const relTypeStr = `[${edgeVariable}:${field.type}]`;
    const labels = node.getLabelString(context);
    const matchStr = `MATCH (${varName})${inStr}${relTypeStr}${outStr}(${nodeVariable}${labels})`; */

    // rfcd
    Object.entries(whereInput).map(([key, value]) => {
        const match = whereRegEx.exec(key);
        if (!match) {
            throw new Error(`Failed to match key in filter: ${key}`);
        }

        const { prefix, fieldName, isAggregate, operator } = match?.groups as WhereRegexGroups;
        const relationField = node.relationFields.find((x) => x.fieldName === fieldName);

        if (isAggregate) {
            if (!relationField) throw new Error("Aggregate filters must be on relationship fields");
            const refNode = context.nodes.find((x) => x.name === relationField.typeMeta.name) as Node;
            const direction = relationField.direction;
            const aggregationTarget = new Cypher.Node({ labels: refNode.getLabels(context) });
            const cypherRelation = new Cypher.Relationship({
                source: matchNode,
                target: aggregationTarget,
                type: relationField.type,
            });
            if (direction === "IN") {
                cypherRelation.reverse();
            }
            const match = new Cypher.Match(cypherRelation);

            const relationship = context.relationships.find(
                (x) => x.properties === relationField.properties
            ) as Relationship;
            Object.entries(value as any).map(([key, value]) => {
                ["count", "count_LT", "count_LTE", "count_GT", "count_GTE"].forEach((countType) => {
                    if (key === countType) {
                        const paramName = new Cypher.Param(value);
                        const _match = whereRegEx.exec(key);
                        if (!_match) {
                            throw new Error(`Failed to match key in filter: ${key}`);
                        }
                        const [, _operator] = countType.split("_");

                        const count = Cypher.count(aggregationTarget);
                        new Cypher.RawCypher((env) => {
                            const returnedBoolean = createBaseOperation({
                                operator: _operator,
                                property: count,
                                param: paramName,
                            });
                            return returnedBoolean.getCypher(env);
                        });
                    }
                });
            });

            return [];
        }
        return [key, value];
    });
    // eofrfcd
}
