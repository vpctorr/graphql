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
export const AuthorizationAnnotationArguments = ["filter", "validate"];
export const AuthorizationFilterOperationRule = [
    "READ",
    "AGGREGATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
];
export const AuthorizationValidateOperationRule = [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
];
export class AuthorizationAnnotation {
    constructor({ filter, validate }) {
        this.name = "authorization";
        this.filter = filter;
        this.validate = validate;
    }
}
export class BaseAuthorizationRule {
    constructor({ operations, requireAuthentication, where, }) {
        this.operations = operations;
        this.requireAuthentication = requireAuthentication ?? true;
        this.where = where;
    }
}
export class AuthorizationFilterRule extends BaseAuthorizationRule {
    constructor({ operations, ...rest }) {
        super({
            operations: operations ?? [...AuthorizationFilterOperationRule],
            ...rest,
        });
    }
}
export class AuthorizationValidateRule extends BaseAuthorizationRule {
    constructor({ operations, when, ...rest }) {
        super({
            operations: operations ?? [...AuthorizationValidateOperationRule],
            ...rest,
        });
        this.when = when ?? ["BEFORE", "AFTER"];
    }
}
