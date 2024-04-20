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
import { UnsupportedUnwindOptimization } from "./types";
import { Neo4jGraphQLError } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import { CreateAST, NestedCreateAST } from "./GraphQLInputAST/GraphQLInputAST";
import mapToDbProperty from "../../utils/map-to-db-property";
function getRelationshipFields(node, key, context) {
    const relationField = node.relationFields.find((x) => key === x.fieldName);
    const refNodes = [];
    if (relationField) {
        if (relationField.interface || relationField.union) {
            throw new UnsupportedUnwindOptimization(`Not supported operation: Interface or Union`);
        }
        else {
            const node = context.nodes.find((x) => x.name === relationField.typeMeta.name);
            if (node) {
                refNodes.push(node);
            }
        }
    }
    return [relationField, refNodes];
}
export function inputTreeToCypherMap(input, node, context, parentKey, relationship) {
    if (Array.isArray(input)) {
        return new Cypher.List(input.map((GraphQLCreateInput) => inputTreeToCypherMap(GraphQLCreateInput, node, context, parentKey, relationship)));
    }
    const properties = Object.entries(input).reduce((obj, [key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField && relationField.properties) {
            relationship = context.relationships.find((x) => x.properties === relationField.properties);
        }
        let scalarOrEnum = false;
        if (parentKey === "edge") {
            if (!relationship) {
                throw new Error("Transpile error: relationship expected to be defined");
            }
            scalarOrEnum = isScalarOrEnum(key, relationship);
        }
        // it assume that if parentKey is not defined then it means that the key belong to a Node
        else if (parentKey === "node" || parentKey === undefined) {
            scalarOrEnum = isScalarOrEnum(key, node);
        }
        if (typeof value === "object" && value !== null && (relationField || !scalarOrEnum)) {
            const nodeInput = relationField ? relatedNodes[0] : node;
            if (Array.isArray(value)) {
                obj[key] = new Cypher.List(value.map((GraphQLCreateInput) => inputTreeToCypherMap(GraphQLCreateInput, nodeInput, context, key, relationship)));
                return obj;
            }
            obj[key] = inputTreeToCypherMap(value, nodeInput, context, key, relationship);
            return obj;
        }
        obj[key] = new Cypher.Param(value);
        return obj;
    }, {});
    return new Cypher.Map(properties);
}
function isScalarOrEnum(fieldName, graphElement) {
    const scalarOrEnumPredicate = (x) => x.fieldName === fieldName;
    const scalarOrEnumFields = [
        graphElement.primitiveFields,
        graphElement.temporalFields,
        graphElement.pointFields,
        graphElement.scalarFields,
        graphElement.enumFields,
    ];
    return scalarOrEnumFields.flat().some(scalarOrEnumPredicate);
}
export function getTreeDescriptor(input, node, context, parentKey, relationship) {
    return Object.entries(input).reduce((previous, [key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField && relationField.properties) {
            relationship = context.relationships.find((x) => x.properties === relationField.properties);
        }
        let scalarOrEnum = false;
        if (parentKey === "edge") {
            if (!relationship) {
                throw new Error("Transpile error: relationship expected to be defined");
            }
            scalarOrEnum = isScalarOrEnum(key, relationship);
        }
        // it assume that if parentKey is not defined then it means that the key belong to a Node
        else if (parentKey === "node" || parentKey === undefined) {
            scalarOrEnum = isScalarOrEnum(key, node);
        }
        if (typeof value === "object" && value !== null && !scalarOrEnum) {
            // TODO: supports union/interfaces
            const innerNode = relationField && relatedNodes[0] ? relatedNodes[0] : node;
            if (Array.isArray(value)) {
                previous.children[key] = mergeTreeDescriptors(value.map((el) => getTreeDescriptor(el, innerNode, context, key, relationship)));
                return previous;
            }
            previous.children[key] = getTreeDescriptor(value, innerNode, context, key, relationship);
            return previous;
        }
        previous.properties.add(key);
        return previous;
    }, { properties: new Set(), children: {} });
}
export function mergeTreeDescriptors(input) {
    return input.reduce((previous, node) => {
        previous.properties = new Set([...previous.properties, ...node.properties]);
        const entries = [...new Set([...Object.keys(previous.children), ...Object.keys(node.children)])].map((childrenKey) => {
            const previousChildren = previous.children[childrenKey] ?? {
                properties: new Set(),
                children: {},
            };
            const nodeChildren = node.children[childrenKey] ?? {
                properties: new Set(),
                children: {},
            };
            return [childrenKey, mergeTreeDescriptors([previousChildren, nodeChildren])];
        });
        previous.children = Object.fromEntries(entries);
        return previous;
    }, { properties: new Set(), children: {} });
}
function parser(input, node, context, parentASTNode, counter) {
    Object.entries(input.children).forEach(([key, value]) => {
        const [relationField, relatedNodes] = getRelationshipFields(node, key, context);
        if (relationField) {
            let edge;
            if (relationField.properties) {
                edge = context.relationships.find((x) => x.properties === relationField.properties);
                if (!edge) {
                    throw new Error("Transpile error: relationship expected to be defined");
                }
            }
            if (relationField.interface || relationField.union) {
                throw new UnsupportedUnwindOptimization(`Not supported operation: Interface or Union`);
            }
            Object.entries(value.children).forEach(([operation, description]) => {
                switch (operation) {
                    case "create":
                        parentASTNode.addChildren(parseNestedCreate(description, relatedNodes[0], context, node, key, [relationField, relatedNodes], counter++, edge));
                        break;
                    /*
                    case "connect":
                         parentASTNode.addChildren(
                            parseConnect(description, relatedNodes[0], context, node, key, [
                                relationField,
                                relatedNodes,
                            ])
                        );
                        break;
                    case "connectOrCreate":
                         parentASTNode.addChildren(parseConnectOrCreate(description, relatedNodes[0], context, node));
                        break;
                    */
                    default:
                        throw new UnsupportedUnwindOptimization(`Not supported operation: ${operation}`);
                }
            });
        }
    });
    return parentASTNode;
}
function raiseAttributeAmbiguity(properties, graphElement) {
    const hash = {};
    properties.forEach((property) => {
        const dbName = mapToDbProperty(graphElement, property);
        if (hash[dbName]) {
            throw new Neo4jGraphQLError(`Conflicting modification of ${[hash[dbName], property].map((n) => `[[${n}]]`).join(", ")} on type ${graphElement.name}`);
        }
        hash[dbName] = property;
    });
}
function raiseOnNotSupportedProperty(graphElement) {
    graphElement.primitiveFields.forEach((property) => {
        if (property.callback && property.callback.operations.includes("CREATE")) {
            throw new UnsupportedUnwindOptimization("Not supported operation: Callback");
        }
    });
}
export function parseCreate(input, node, context, counter = 0) {
    const nodeProperties = input.properties;
    raiseOnNotSupportedProperty(node);
    raiseAttributeAmbiguity(input.properties, node);
    const createAST = new CreateAST(counter++, [...nodeProperties], node);
    parser(input, node, context, createAST, counter);
    return createAST;
}
function parseNestedCreate(input, node, context, parentNode, relationshipPropertyPath, relationship, counter, edge) {
    if (!relationship[0]) {
        throw new Error("what?");
    }
    if (!input.children.node) {
        throw new Error("Transpile error: node expected to be defined");
    }
    const nodeProperties = input.children.node.properties;
    const edgeProperties = input.children.edge ? input.children.edge.properties : [];
    raiseOnNotSupportedProperty(node);
    raiseAttributeAmbiguity(nodeProperties, node);
    if (edge) {
        raiseOnNotSupportedProperty(edge);
        raiseAttributeAmbiguity(edgeProperties, edge);
    }
    const nestedCreateAST = new NestedCreateAST(counter++, node, parentNode, [...nodeProperties], [...edgeProperties], relationshipPropertyPath, relationship, edge);
    if (input.children.node) {
        parser(input.children.node, node, context, nestedCreateAST, counter);
    }
    return nestedCreateAST;
}
