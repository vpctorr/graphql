import { GraphQLError } from "graphql";
export declare class Neo4jGraphQLError extends GraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLForbiddenError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLAuthenticationError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLConstraintValidationError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLRelationshipValidationError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLSchemaValidationError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
