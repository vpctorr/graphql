import type { GraphQLWhereArg } from "../../types";
import type { Annotation } from "./Annotation";
export type AuthenticationOperation = "READ" | "AGGREGATE" | "CREATE" | "UPDATE" | "DELETE" | "CREATE_RELATIONSHIP" | "DELETE_RELATIONSHIP" | "SUBSCRIBE";
export declare class AuthenticationAnnotation implements Annotation {
    readonly name = "authentication";
    readonly operations: Set<AuthenticationOperation>;
    readonly jwt?: GraphQLWhereArg;
    constructor(operations: AuthenticationOperation[], jwt?: GraphQLWhereArg);
}
