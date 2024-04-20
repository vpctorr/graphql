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
export var GraphQLBuiltInScalarType;
(function (GraphQLBuiltInScalarType) {
    GraphQLBuiltInScalarType["Int"] = "Int";
    GraphQLBuiltInScalarType["Float"] = "Float";
    GraphQLBuiltInScalarType["String"] = "String";
    GraphQLBuiltInScalarType["Boolean"] = "Boolean";
    GraphQLBuiltInScalarType["ID"] = "ID";
})(GraphQLBuiltInScalarType || (GraphQLBuiltInScalarType = {}));
export var Neo4jGraphQLSpatialType;
(function (Neo4jGraphQLSpatialType) {
    Neo4jGraphQLSpatialType["CartesianPoint"] = "CartesianPoint";
    Neo4jGraphQLSpatialType["Point"] = "Point";
})(Neo4jGraphQLSpatialType || (Neo4jGraphQLSpatialType = {}));
export var Neo4jGraphQLNumberType;
(function (Neo4jGraphQLNumberType) {
    Neo4jGraphQLNumberType["BigInt"] = "BigInt";
})(Neo4jGraphQLNumberType || (Neo4jGraphQLNumberType = {}));
export var Neo4jGraphQLTemporalType;
(function (Neo4jGraphQLTemporalType) {
    Neo4jGraphQLTemporalType["DateTime"] = "DateTime";
    Neo4jGraphQLTemporalType["LocalDateTime"] = "LocalDateTime";
    Neo4jGraphQLTemporalType["Time"] = "Time";
    Neo4jGraphQLTemporalType["LocalTime"] = "LocalTime";
    Neo4jGraphQLTemporalType["Date"] = "Date";
    Neo4jGraphQLTemporalType["Duration"] = "Duration";
})(Neo4jGraphQLTemporalType || (Neo4jGraphQLTemporalType = {}));
// The ScalarType class is not used to represent user defined scalar types, see UserScalarType for that.
export class ScalarType {
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class Neo4jCartesianPointType {
    constructor(isRequired) {
        this.name = Neo4jGraphQLSpatialType.CartesianPoint;
        this.isRequired = isRequired;
    }
}
export class Neo4jPointType {
    constructor(isRequired) {
        this.name = Neo4jGraphQLSpatialType.Point;
        this.isRequired = isRequired;
    }
}
export class UserScalarType {
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class ObjectType {
    // TODO: add fields
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
// TODO: consider replacing this with a isList field on the other classes
export class ListType {
    constructor(ofType, isRequired) {
        this.name = `List<${ofType.name}>`;
        this.ofType = ofType;
        this.isRequired = isRequired;
    }
}
export class EnumType {
    // TODO: add enum values
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class UnionType {
    // TODO: add implementing types
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class InterfaceType {
    // TODO: add shared fields
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class InputType {
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
export class UnknownType {
    constructor(name, isRequired) {
        this.name = name;
        this.isRequired = isRequired;
    }
}
