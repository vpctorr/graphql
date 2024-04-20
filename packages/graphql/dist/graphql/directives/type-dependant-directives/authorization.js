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
import { astFromDirective, astFromInputObjectType } from "@graphql-tools/utils";
import { GraphQLString, GraphQLSchema, GraphQLDirective, GraphQLInputObjectType, GraphQLList, GraphQLBoolean, DirectiveLocation, } from "graphql";
import { AUTHORIZATION_FILTER_OPERATION, AUTHORIZATION_VALIDATE_OPERATION, AUTHORIZATION_VALIDATE_STAGE, } from "./static-definitions";
function createAuthorizationWhere(typeDefinitionName, schema, jwtWhere) {
    /**
     * Both inputWhere and JWTPayloadWhere can be undefined,
     * JWTPayload can be not defined by the User in the user document,
     * and unused interface will not generate the {typeDefinitionName}Where making the inputWhere undefined
     * */
    const inputWhere = schema.getType(`${typeDefinitionName}Where`);
    const authorizationWhere = new GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationWhere`,
        fields() {
            return {
                AND: {
                    type: new GraphQLList(authorizationWhere),
                },
                OR: {
                    type: new GraphQLList(authorizationWhere),
                },
                NOT: {
                    type: authorizationWhere,
                },
                ...(inputWhere
                    ? {
                        node: {
                            type: inputWhere,
                        },
                    }
                    : {}),
                jwt: {
                    type: jwtWhere,
                },
            };
        },
    });
    return authorizationWhere;
}
function createAuthorizationFilterRule(typeDefinitionName, inputWhere) {
    return new GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationFilterRule`,
        fields() {
            return {
                operations: {
                    type: new GraphQLList(AUTHORIZATION_FILTER_OPERATION),
                    defaultValue: [
                        "READ",
                        "AGGREGATE",
                        "UPDATE",
                        "DELETE",
                        "CREATE_RELATIONSHIP",
                        "DELETE_RELATIONSHIP",
                    ],
                },
                requireAuthentication: {
                    type: GraphQLBoolean,
                    defaultValue: true,
                },
                where: {
                    type: inputWhere,
                },
            };
        },
    });
}
function createAuthorizationValidateRule(typeDefinitionName, inputWhere) {
    return new GraphQLInputObjectType({
        name: `${typeDefinitionName}AuthorizationValidateRule`,
        fields() {
            return {
                operations: {
                    type: new GraphQLList(AUTHORIZATION_VALIDATE_OPERATION),
                    defaultValue: [
                        "READ",
                        "AGGREGATE",
                        "CREATE",
                        "UPDATE",
                        "DELETE",
                        "CREATE_RELATIONSHIP",
                        "DELETE_RELATIONSHIP",
                    ],
                },
                when: {
                    type: new GraphQLList(AUTHORIZATION_VALIDATE_STAGE),
                    defaultValue: ["BEFORE", "AFTER"],
                },
                requireAuthentication: {
                    type: GraphQLBoolean,
                    defaultValue: true,
                },
                where: {
                    type: inputWhere,
                },
            };
        },
    });
}
function createAuthorization({ typeDefinitionName, filterRule, validateRule, }) {
    return new GraphQLDirective({
        name: `${typeDefinitionName}Authorization`,
        locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
        args: {
            filter: {
                description: "filter",
                type: new GraphQLList(filterRule),
            },
            validate: {
                description: "validate",
                type: new GraphQLList(validateRule),
            },
        },
    });
}
export function createAuthorizationDefinitions(typeDefinitionName, schema) {
    const jwtWhere = new GraphQLInputObjectType({ name: "JWTPayloadWhere", fields: {} });
    const authorizationWhere = createAuthorizationWhere(typeDefinitionName, schema, jwtWhere);
    const authorizationFilterRule = createAuthorizationFilterRule(typeDefinitionName, authorizationWhere);
    const authorizationValidateRule = createAuthorizationValidateRule(typeDefinitionName, authorizationWhere);
    const authorization = createAuthorization({
        typeDefinitionName,
        filterRule: authorizationFilterRule,
        validateRule: authorizationValidateRule,
    });
    const authorizationSchema = new GraphQLSchema({
        directives: [authorization],
        types: [authorizationWhere, authorizationFilterRule, authorizationValidateRule],
    });
    const authorizationWhereAST = astFromInputObjectType(authorizationWhere, authorizationSchema);
    const authorizationFilterRuleAST = astFromInputObjectType(authorizationFilterRule, authorizationSchema);
    const authorizationValidateRuleAST = astFromInputObjectType(authorizationValidateRule, authorizationSchema);
    const authorizationAST = astFromDirective(authorization);
    return [authorizationWhereAST, authorizationFilterRuleAST, authorizationValidateRuleAST, authorizationAST];
}
export const authorizationDirectiveScaffold = new GraphQLDirective({
    name: `authorization`,
    description: "This is a simpler version of the authorization directive to be used in the validate-document step.",
    locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
    args: {
        filter: {
            description: "filter",
            type: new GraphQLList(GraphQLString),
        },
        validate: {
            description: "validate",
            type: new GraphQLList(GraphQLString),
        },
    },
});
