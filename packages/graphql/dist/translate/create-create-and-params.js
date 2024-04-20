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
import { Neo4jGraphQLError } from "../classes/Error";
import createConnectAndParams from "./create-connect-and-params";
import createSetRelationshipPropertiesAndParams from "./create-set-relationship-properties-and-params";
import mapToDbProperty from "../utils/map-to-db-property";
import { createConnectOrCreateAndParams } from "./create-connect-or-create-and-params";
import createRelationshipValidationStr from "./create-relationship-validation-string";
import { createEventMeta } from "./subscriptions/create-event-meta";
import { createConnectionEventMeta } from "./subscriptions/create-connection-event-meta";
import { addCallbackAndSetParam } from "./utils/callback-utils";
import { findConflictingProperties } from "../utils/is-property-clash";
import { createAuthorizationAfterAndParamsField, createAuthorizationAfterAndParams, } from "./authorization/compatibility/create-authorization-after-and-params";
import { checkAuthentication } from "./authorization/check-authentication";
function createCreateAndParams({ input, varName, node, context, callbackBucket, withVars, includeRelationshipValidation, topLevelNodeVariable, authorizationPrefix = [0], }) {
    const conflictingProperties = findConflictingProperties({ node, input });
    if (conflictingProperties.length > 0) {
        throw new Neo4jGraphQLError(`Conflicting modification of ${conflictingProperties.map((n) => `[[${n}]]`).join(", ")} on type ${node.name}`);
    }
    checkAuthentication({ context, node, targetOperations: ["CREATE"] });
    function reducer(res, [key, value], reducerIndex) {
        const varNameKey = `${varName}_${key}`;
        const relationField = node.relationFields.find((x) => key === x.fieldName);
        const primitiveField = node.primitiveFields.find((x) => key === x.fieldName);
        const pointField = node.pointFields.find((x) => key === x.fieldName);
        const dbFieldName = mapToDbProperty(node, key);
        if (primitiveField) {
            checkAuthentication({ context, node, targetOperations: ["CREATE"], field: primitiveField.fieldName });
        }
        if (relationField) {
            const refNodes = [];
            if (relationField.union) {
                Object.keys(value).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName));
                });
            }
            else if (relationField.interface) {
                relationField.interface?.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName));
                });
            }
            else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name));
            }
            refNodes.forEach((refNode, refNodeIndex) => {
                const v = relationField.union ? value[refNode.name] : value;
                const unionTypeName = relationField.union || relationField.interface ? refNode.name : "";
                if (v.create) {
                    const isInterfaceAnArray = relationField.interface?.typeMeta.array;
                    const createNodeInputIsOfTypeRefNode = !!v.create.node?.[refNode.name];
                    const createNodeInputKeys = createNodeInputIsOfTypeRefNode
                        ? Object.keys(v.create.node || [])
                        : [];
                    const isCreatingMultipleNodesForOneToOneRel = !isInterfaceAnArray && createNodeInputKeys.length > 1;
                    if (isCreatingMultipleNodesForOneToOneRel) {
                        throw new Error(`Relationship field "${relationField.connectionPrefix}.${relationField.interface?.dbPropertyName || relationField.interface?.fieldName}" cannot have more than one node linked`);
                    }
                    const creates = relationField.typeMeta.array ? v.create : [v.create];
                    creates.forEach((create, createIndex) => {
                        if (relationField.interface && !create.node[refNode.name]) {
                            return;
                        }
                        if (!context.subscriptionsEnabled) {
                            res.creates.push(`\nWITH *`);
                        }
                        const baseName = `${varNameKey}${relationField.union ? "_" : ""}${unionTypeName}${createIndex}`;
                        const nodeName = `${baseName}_node`;
                        const propertiesName = `${baseName}_relationship`;
                        const { create: nestedCreate, params, authorizationPredicates, authorizationSubqueries, } = createCreateAndParams({
                            input: relationField.interface ? create.node[refNode.name] : create.node,
                            context,
                            callbackBucket,
                            node: refNode,
                            varName: nodeName,
                            withVars: [...withVars, nodeName],
                            includeRelationshipValidation: false,
                            topLevelNodeVariable,
                            authorizationPrefix: [...authorizationPrefix, reducerIndex, createIndex, refNodeIndex],
                        });
                        res.creates.push(nestedCreate);
                        res.params = { ...res.params, ...params };
                        const inStr = relationField.direction === "IN" ? "<-" : "-";
                        const outStr = relationField.direction === "OUT" ? "->" : "-";
                        const relationVarName = relationField.properties || context.subscriptionsEnabled ? propertiesName : "";
                        const relTypeStr = `[${relationVarName}:${relationField.type}]`;
                        res.creates.push(`MERGE (${varName})${inStr}${relTypeStr}${outStr}(${nodeName})`);
                        if (relationField.properties) {
                            const relationship = context.relationships.find((x) => x.properties === relationField.properties);
                            const setA = createSetRelationshipPropertiesAndParams({
                                properties: create.edge ?? {},
                                varName: propertiesName,
                                relationship,
                                operation: "CREATE",
                                callbackBucket,
                            });
                            res.creates.push(setA[0]);
                            res.params = { ...res.params, ...setA[1] };
                        }
                        if (authorizationPredicates.length) {
                            if (authorizationSubqueries.length) {
                                res.meta.authorizationSubqueries.push(...authorizationSubqueries);
                            }
                            res.meta.authorizationPredicates.push(...authorizationPredicates);
                        }
                        if (context.subscriptionsEnabled) {
                            const [fromVariable, toVariable] = relationField.direction === "IN" ? [nodeName, varName] : [varName, nodeName];
                            const [fromTypename, toTypename] = relationField.direction === "IN"
                                ? [refNode.name, node.name]
                                : [node.name, refNode.name];
                            const eventWithMetaStr = createConnectionEventMeta({
                                event: "create_relationship",
                                relVariable: propertiesName,
                                fromVariable,
                                toVariable,
                                typename: relationField.typeUnescaped,
                                fromTypename,
                                toTypename,
                            });
                            res.creates.push(`WITH *, ${eventWithMetaStr}`);
                        }
                        const relationshipValidationStr = createRelationshipValidationStr({
                            node: refNode,
                            context,
                            varName: nodeName,
                        });
                        if (relationshipValidationStr) {
                            res.creates.push(`WITH *`);
                            res.creates.push(relationshipValidationStr);
                        }
                    });
                }
                if (!relationField.interface && v.connect) {
                    const connectAndParams = createConnectAndParams({
                        withVars,
                        value: v.connect,
                        varName: `${varNameKey}${relationField.union ? "_" : ""}${unionTypeName}_connect`,
                        parentVar: varName,
                        relationField,
                        context,
                        callbackBucket,
                        refNodes: [refNode],
                        labelOverride: unionTypeName,
                        parentNode: node,
                        source: "CREATE",
                        indexPrefix: makeAuthorizationParamsPrefix(authorizationPrefix),
                    });
                    res.creates.push(connectAndParams[0]);
                    res.params = { ...res.params, ...connectAndParams[1] };
                }
                if (v.connectOrCreate) {
                    const { cypher, params } = createConnectOrCreateAndParams({
                        input: v.connectOrCreate,
                        varName: `${varNameKey}${relationField.union ? "_" : ""}${unionTypeName}_connectOrCreate`,
                        parentVar: varName,
                        relationField,
                        refNode,
                        node,
                        context,
                        withVars,
                        callbackBucket,
                    });
                    res.creates.push(cypher);
                    res.params = { ...res.params, ...params };
                }
            });
            if (relationField.interface && value.connect) {
                const connectAndParams = createConnectAndParams({
                    withVars,
                    value: value.connect,
                    varName: `${varNameKey}${relationField.union ? "_" : ""}_connect`,
                    parentVar: varName,
                    relationField,
                    context,
                    callbackBucket,
                    refNodes,
                    labelOverride: "",
                    parentNode: node,
                    source: "CREATE",
                });
                res.creates.push(connectAndParams[0]);
                res.params = { ...res.params, ...connectAndParams[1] };
            }
            return res;
        }
        const authorizationAndParams = createAuthorizationAfterAndParamsField({
            context,
            nodes: [
                {
                    variable: varName,
                    node,
                    fieldName: primitiveField?.fieldName,
                },
            ],
            operations: ["CREATE"],
            indexPrefix: makeAuthorizationParamsPrefix(authorizationPrefix),
        });
        if (authorizationAndParams) {
            const { cypher, params: authParams, subqueries } = authorizationAndParams;
            if (subqueries) {
                res.meta.authorizationSubqueries.push(subqueries);
            }
            res.meta.authorizationPredicates.push(cypher);
            res.params = { ...res.params, ...authParams };
        }
        if (pointField) {
            if (pointField.typeMeta.array) {
                res.creates.push(`SET ${varName}.${dbFieldName} = [p in $${varNameKey} | point(p)]`);
            }
            else {
                res.creates.push(`SET ${varName}.${dbFieldName} = point($${varNameKey})`);
            }
            res.params[varNameKey] = value;
            return res;
        }
        res.creates.push(`SET ${varName}.${dbFieldName} = $${varNameKey}`);
        res.params[varNameKey] = value;
        return res;
    }
    const labels = node.getLabelString(context);
    const initial = [`CREATE (${varName}${labels})`];
    const timestampedFields = node.temporalFields.filter((x) => ["DateTime", "Time"].includes(x.typeMeta.name) && x.timestamps?.includes("CREATE"));
    timestampedFields.forEach((field) => {
        // DateTime -> datetime(); Time -> time()
        initial.push(`SET ${varName}.${field.dbPropertyName} = ${field.typeMeta.name.toLowerCase()}()`);
    });
    node.primitiveFields.forEach((field) => addCallbackAndSetParam(field, varName, input, callbackBucket, initial, "CREATE"));
    const autogeneratedIdFields = node.primitiveFields.filter((x) => x.autogenerate);
    autogeneratedIdFields.forEach((f) => {
        initial.push(`SET ${varName}.${f.dbPropertyName} = randomUUID()`);
    });
    // eslint-disable-next-line prefer-const
    let { creates, params, meta } = Object.entries(input).reduce(reducer, {
        creates: initial,
        params: {},
        meta: {
            authorizationPredicates: [],
            authorizationSubqueries: [],
        },
    });
    if (context.subscriptionsEnabled) {
        const eventWithMetaStr = createEventMeta({ event: "create", nodeVariable: varName, typename: node.name });
        const withStrs = [eventWithMetaStr];
        creates.push(`WITH *, ${withStrs.join(", ")}`);
    }
    const { authorizationPredicates, authorizationSubqueries } = meta;
    const authorizationAndParams = createAuthorizationAfterAndParams({
        context,
        nodes: [
            {
                variable: varName,
                node,
            },
        ],
        operations: ["CREATE"],
        indexPrefix: makeAuthorizationParamsPrefix(authorizationPrefix),
    });
    if (authorizationAndParams) {
        const { cypher, params: authParams, subqueries } = authorizationAndParams;
        if (subqueries) {
            authorizationSubqueries.push(subqueries);
        }
        authorizationPredicates.push(cypher);
        params = { ...params, ...authParams };
    }
    if (includeRelationshipValidation) {
        const str = createRelationshipValidationStr({ node, context, varName });
        if (str) {
            creates.push(`WITH *`);
            creates.push(str);
        }
    }
    return { create: creates.join("\n"), params, authorizationPredicates, authorizationSubqueries };
}
function makeAuthorizationParamsPrefix(authorizationPrefix) {
    return `${authorizationPrefix.join("_")}_`;
}
export default createCreateAndParams;
