import type { GraphQLWhereArg } from "../../types";
import type { Annotation } from "./Annotation";
import type { ValueOf } from "../../utils/value-of";
export declare const SubscriptionsAuthorizationFilterEventRule: readonly ["CREATED", "UPDATED", "DELETED", "RELATIONSHIP_CREATED", "RELATIONSHIP_DELETED"];
export type SubscriptionsAuthorizationFilterEvent = ValueOf<typeof SubscriptionsAuthorizationFilterEventRule>;
export type SubscriptionsAuthorizationWhere = {
    AND?: SubscriptionsAuthorizationWhere[];
    OR?: SubscriptionsAuthorizationWhere[];
    NOT?: SubscriptionsAuthorizationWhere;
    jwt?: GraphQLWhereArg;
    node?: GraphQLWhereArg;
    relationship?: GraphQLWhereArg;
};
export declare class SubscriptionsAuthorizationAnnotation implements Annotation {
    readonly name = "subscriptionsAuthorization";
    filter?: SubscriptionsAuthorizationFilterRule[];
    constructor({ filter }: {
        filter?: SubscriptionsAuthorizationFilterRule[];
    });
}
export type SubscriptionsAuthorizationFilterRuleConstructor = {
    events?: SubscriptionsAuthorizationFilterEvent[];
    requireAuthentication?: boolean;
    where: SubscriptionsAuthorizationWhere;
};
export declare class SubscriptionsAuthorizationFilterRule {
    events: SubscriptionsAuthorizationFilterEvent[];
    requireAuthentication: boolean;
    where: SubscriptionsAuthorizationWhere;
    constructor({ events, requireAuthentication, where }: SubscriptionsAuthorizationFilterRuleConstructor);
}
