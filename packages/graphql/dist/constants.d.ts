export declare const AUTH_FORBIDDEN_ERROR = "@neo4j/graphql/FORBIDDEN";
export declare const AUTH_UNAUTHENTICATED_ERROR = "@neo4j/graphql/UNAUTHENTICATED";
export declare const MIN_NEO4J_VERSION = "4.4";
export declare const REQUIRED_APOC_FUNCTIONS: string[];
export declare const AUTHORIZATION_UNAUTHENTICATED = "Unauthenticated";
export declare const DEBUG_ALL: string;
export declare const DEBUG_AUTH: string;
export declare const DEBUG_EXECUTE: string;
export declare const DEBUG_GENERATE: string;
export declare const DEBUG_GRAPHQL: string;
export declare const DEBUG_TRANSLATE: string;
export declare const RELATIONSHIP_REQUIREMENT_PREFIX = "@neo4j/graphql/RELATIONSHIP-REQUIRED";
export declare const RESERVED_TYPE_NAMES: {
    regex: RegExp;
    error: string;
}[];
export declare const RESERVED_INTERFACE_FIELDS: string[][];
export declare const GRAPHQL_BUILTIN_SCALAR_TYPES: string[];
export declare const TEMPORAL_SCALAR_TYPES: string[];
export declare const SCALAR_TYPES: string[];
export declare const SPATIAL_TYPES: string[];
export declare function isTemporal(typeName: string): boolean;
export declare function isSpatial(typeName: string): boolean;
export declare const LOGICAL_OPERATORS: readonly ["AND", "OR", "NOT"];
export declare const AGGREGATION_COMPARISON_OPERATORS: readonly ["EQUAL", "GT", "GTE", "LT", "LTE"];
export declare enum RelationshipQueryDirectionOption {
    DEFAULT_DIRECTED = "DEFAULT_DIRECTED",
    DEFAULT_UNDIRECTED = "DEFAULT_UNDIRECTED",
    DIRECTED_ONLY = "DIRECTED_ONLY",
    UNDIRECTED_ONLY = "UNDIRECTED_ONLY"
}
export declare enum RelationshipNestedOperationsOption {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    CONNECT_OR_CREATE = "CONNECT_OR_CREATE"
}
export declare const META_CYPHER_VARIABLE = "meta";
export declare const META_OLD_PROPS_CYPHER_VARIABLE = "oldProps";
export declare const DBMS_COMPONENTS_QUERY = "CALL dbms.components() YIELD versions, edition UNWIND versions AS version RETURN version, edition";
export declare const DEPRECATED = "deprecated";
export declare const SHAREABLE = "shareable";
export declare const PROPAGATED_DIRECTIVES: readonly ["shareable", "deprecated"];
