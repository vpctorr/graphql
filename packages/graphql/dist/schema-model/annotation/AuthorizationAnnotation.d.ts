import type { GraphQLWhereArg } from "../../types";
import type { Annotation } from "./Annotation";
import type { ValueOf } from "../../utils/value-of";
export declare const AuthorizationAnnotationArguments: readonly ["filter", "validate"];
export declare const AuthorizationFilterOperationRule: readonly ["READ", "AGGREGATE", "UPDATE", "DELETE", "CREATE_RELATIONSHIP", "DELETE_RELATIONSHIP"];
export declare const AuthorizationValidateOperationRule: readonly ["READ", "AGGREGATE", "CREATE", "UPDATE", "DELETE", "CREATE_RELATIONSHIP", "DELETE_RELATIONSHIP"];
type AuthorizationFilterOperation = ValueOf<typeof AuthorizationFilterOperationRule>;
type AuthorizationValidateOperation = ValueOf<typeof AuthorizationValidateOperationRule>;
export type AuthorizationOperation = AuthorizationFilterOperation | AuthorizationValidateOperation;
export type ValidateWhen = "BEFORE" | "AFTER";
type AuthorizationWhere = {
    AND?: AuthorizationWhere[];
    OR?: AuthorizationWhere[];
    NOT?: AuthorizationWhere;
    jwt?: GraphQLWhereArg;
    node?: GraphQLWhereArg;
};
export declare class AuthorizationAnnotation implements Annotation {
    readonly name = "authorization";
    filter?: AuthorizationFilterRule[];
    validate?: AuthorizationValidateRule[];
    constructor({ filter, validate }: {
        filter?: AuthorizationFilterRule[];
        validate?: AuthorizationValidateRule[];
    });
}
type BaseAuthorizationRuleConstructor = {
    requireAuthentication?: boolean;
    where: AuthorizationWhere;
};
export declare abstract class BaseAuthorizationRule<T extends AuthorizationOperation> {
    readonly operations: T[];
    readonly requireAuthentication: boolean;
    readonly where: AuthorizationWhere;
    protected constructor({ operations, requireAuthentication, where, }: BaseAuthorizationRuleConstructor & {
        operations: T[];
    });
}
export type AuthorizationFilterRuleConstructor = BaseAuthorizationRuleConstructor & {
    operations?: AuthorizationFilterOperation[];
};
export declare class AuthorizationFilterRule extends BaseAuthorizationRule<AuthorizationFilterOperation> {
    constructor({ operations, ...rest }: AuthorizationFilterRuleConstructor);
}
export type AuthorizationValidateRuleConstructor = BaseAuthorizationRuleConstructor & {
    operations?: AuthorizationValidateOperation[];
    when?: ValidateWhen[];
};
export declare class AuthorizationValidateRule extends BaseAuthorizationRule<AuthorizationValidateOperation> {
    when: ValidateWhen[];
    constructor({ operations, when, ...rest }: AuthorizationValidateRuleConstructor);
}
export {};
