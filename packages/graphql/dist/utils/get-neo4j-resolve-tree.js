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
import { GraphQLInputObjectType, GraphQLScalarType, Kind } from "graphql";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import neo4j from "neo4j-driver";
function getNeo4jArgumentValue({ argument, type }) {
    if (argument === null) {
        return argument;
    }
    if (type.toString().endsWith("!")) {
        return getNeo4jArgumentValue({ argument, type: type.ofType });
    }
    if (type.toString().startsWith("[") && type.toString().endsWith("]")) {
        return argument.map((a) => getNeo4jArgumentValue({ argument: a, type: type.ofType }));
    }
    if (type instanceof GraphQLInputObjectType) {
        return Object.entries(argument).reduce((res, [key, value]) => {
            // Ignore meta field _emptyInput
            if (key === "_emptyInput") {
                return res;
            }
            const field = Object.values(type.getFields()).find((f) => f.name === key);
            if (!field) {
                throw new Error(`Error whilst generating Neo4j resolve tree: could not find field ${key} in type ${type.name}`);
            }
            return {
                ...res,
                [key]: getNeo4jArgumentValue({ argument: value, type: field.type }),
            };
        }, {});
    }
    if (type instanceof GraphQLScalarType) {
        if (type.name === "Int") {
            return neo4j.int(argument);
        }
        if (type.name === "ID") {
            if (typeof argument === "number") {
                return argument.toString(10);
            }
        }
    }
    return argument;
}
function findField(schema, fieldName) {
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    const queryFields = queryType?.getFields()[fieldName];
    const mutationFields = mutationType?.getFields()[fieldName];
    const subscriptionFields = subscriptionType?.getFields()[fieldName];
    const field = queryFields || mutationFields || subscriptionFields;
    if (!field)
        throw new Error(`Field ${field} not found`);
    return field;
}
export default function getNeo4jResolveTree(resolveInfo, options) {
    const resolveTree = options?.resolveTree || parseResolveInfo(resolveInfo);
    const resolverArgs = options?.args;
    const mergedArgs = { ...resolveTree.args, ...resolverArgs };
    let field;
    if (options?.field) {
        field = options.field;
    }
    else {
        field = findField(resolveInfo.schema, resolveTree.name);
    }
    const args = Object.entries(mergedArgs).reduce((res, [name, value]) => {
        const argument = field.args.find((arg) => arg.name === name);
        if (!argument) {
            throw new Error(`Error whilst generating Neo4j resolve tree: could not find argument ${name} on field ${field.name}`);
        }
        return {
            ...res,
            [name]: getNeo4jArgumentValue({ argument: value, type: argument.type }),
        };
    }, {});
    const fieldsByTypeName = Object.entries(resolveTree.fieldsByTypeName).reduce((res, [typeName, fields]) => {
        let type;
        const _type = resolveInfo.schema.getType(typeName);
        if (!_type) {
            throw new Error(`Error whilst generating Neo4j resolve tree: could not find type with name ${typeName} in schema`);
        }
        if (_type.astNode?.kind === Kind.OBJECT_TYPE_DEFINITION) {
            type = _type;
        }
        else if (_type.astNode?.kind === Kind.INTERFACE_TYPE_DEFINITION) {
            type = _type;
        }
        else {
            return {
                ...res,
                [typeName]: fields,
            };
        }
        const resolveTrees = Object.entries(fields).reduce((trees, [fieldName, f]) => {
            return {
                ...trees,
                [fieldName]: getNeo4jResolveTree(resolveInfo, {
                    resolveTree: f,
                    field: Object.values(type.getFields()).find((typeField) => typeField.name === f.name),
                }),
            };
        }, {});
        return {
            ...res,
            [typeName]: resolveTrees,
        };
    }, {});
    const { alias, name } = resolveTree;
    return { alias, args, fieldsByTypeName, name };
}