export declare enum GraphQLBuiltInScalarType {
    Int = "Int",
    Float = "Float",
    String = "String",
    Boolean = "Boolean",
    ID = "ID"
}
export declare enum Neo4jGraphQLSpatialType {
    CartesianPoint = "CartesianPoint",
    Point = "Point"
}
export declare enum Neo4jGraphQLNumberType {
    BigInt = "BigInt"
}
export declare enum Neo4jGraphQLTemporalType {
    DateTime = "DateTime",
    LocalDateTime = "LocalDateTime",
    Time = "Time",
    LocalTime = "LocalTime",
    Date = "Date",
    Duration = "Duration"
}
export type Neo4jGraphQLScalarType = Neo4jGraphQLTemporalType | Neo4jGraphQLNumberType;
export declare class ScalarType {
    readonly name: GraphQLBuiltInScalarType | Neo4jGraphQLScalarType;
    readonly isRequired: boolean;
    constructor(name: GraphQLBuiltInScalarType | Neo4jGraphQLScalarType, isRequired: boolean);
}
export declare class Neo4jCartesianPointType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(isRequired: boolean);
}
export declare class Neo4jPointType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(isRequired: boolean);
}
export declare class UserScalarType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class ObjectType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class ListType {
    readonly name: string;
    readonly ofType: Exclude<AttributeType, ListType>;
    readonly isRequired: boolean;
    constructor(ofType: AttributeType, isRequired: boolean);
}
export declare class EnumType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class UnionType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class InterfaceType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class InputType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export declare class UnknownType {
    readonly name: string;
    readonly isRequired: boolean;
    constructor(name: string, isRequired: boolean);
}
export type AttributeType = ScalarType | UserScalarType | ObjectType | ListType | EnumType | UnionType | InterfaceType | InputType | UnknownType;
