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
import { EnumType, GraphQLBuiltInScalarType, InterfaceType, ListType, Neo4jCartesianPointType, Neo4jGraphQLNumberType, Neo4jGraphQLSpatialType, Neo4jGraphQLTemporalType, Neo4jPointType, ObjectType, ScalarType, UnionType, UserScalarType, } from "../../attribute/AttributeType";
// TODO: this file has a lot in common with AttributeAdapter
// if going to use this, design a solution to avoid this code duplication
export class ArgumentAdapter {
    constructor(argument) {
        this.name = argument.name;
        this.type = argument.type;
        this.defaultValue = argument.defaultValue;
        this.description = argument.description;
        this.assertionOptions = {
            includeLists: true,
        };
    }
    /**
     * Just a helper to get the wrapped type in case of a list, useful for the assertions
     */
    getTypeForAssertion(includeLists) {
        if (includeLists) {
            return this.isList() ? this.type.ofType : this.type;
        }
        return this.type;
    }
    isBoolean(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Boolean;
    }
    isID(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.ID;
    }
    isInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Int;
    }
    isFloat(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Float;
    }
    isString(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.String;
    }
    isCartesianPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof Neo4jCartesianPointType;
    }
    isPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof Neo4jPointType;
    }
    isBigInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLNumberType.BigInt;
    }
    isDate(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.Date;
    }
    isDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.DateTime;
    }
    isLocalDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.LocalDateTime;
    }
    isTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.Time;
    }
    isLocalTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === Neo4jGraphQLTemporalType.LocalTime;
    }
    isDuration(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === Neo4jGraphQLTemporalType.Duration;
    }
    isObject(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ObjectType;
    }
    isEnum(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof EnumType;
    }
    isInterface(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof InterfaceType;
    }
    isUnion(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof UnionType;
    }
    isList() {
        return this.type instanceof ListType;
    }
    isUserScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof UserScalarType;
    }
    isTemporal(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in Neo4jGraphQLTemporalType;
    }
    isListElementRequired() {
        if (!(this.type instanceof ListType)) {
            return false;
        }
        return this.type.ofType.isRequired;
    }
    isRequired() {
        return this.type.isRequired;
    }
    /**
     *
     * Schema Generator Stuff
     *
     */
    isGraphQLBuiltInScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in GraphQLBuiltInScalarType;
    }
    isSpatial(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in Neo4jGraphQLSpatialType;
    }
    isAbstract(options = this.assertionOptions) {
        return this.isInterface(options) || this.isUnion(options);
    }
    /**
     * Returns true for both built-in and user-defined scalars
     **/
    isScalar(options = this.assertionOptions) {
        return (this.isGraphQLBuiltInScalar(options) ||
            this.isTemporal(options) ||
            this.isBigInt(options) ||
            this.isUserScalar(options));
    }
    isNumeric(options = this.assertionOptions) {
        return this.isBigInt(options) || this.isFloat(options) || this.isInt(options);
    }
    /**
     *  END of category assertions
     */
    /**
     *
     * Schema Generator Stuff
     *
     */
    getTypePrettyName() {
        if (this.isList()) {
            return `[${this.getTypeName()}${this.isListElementRequired() ? "!" : ""}]${this.isRequired() ? "!" : ""}`;
        }
        return `${this.getTypeName()}${this.isRequired() ? "!" : ""}`;
    }
    getTypeName() {
        return this.isList() ? this.type.ofType.name : this.type.name;
    }
}
