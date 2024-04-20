import { IDAnnotation } from "./IDAnnotation";
import { RelayIDAnnotation } from "./RelayIDAnnotation";
import type { DirectiveNode } from "graphql";
import { PrivateAnnotation } from "./PrivateAnnotation";
import type { PluralAnnotation } from "./PluralAnnotation";
import type { CustomResolverAnnotation } from "./CustomResolverAnnotation";
import { JWTPayloadAnnotation } from "./JWTPayloadAnnotation";
import type { SelectableAnnotation } from "./SelectableAnnotation";
import type { PopulatedByAnnotation } from "./PopulatedByAnnotation";
import type { SubscriptionAnnotation } from "./SubscriptionAnnotation";
import type { AuthorizationAnnotation } from "./AuthorizationAnnotation";
import type { DefaultAnnotation } from "./DefaultAnnotation";
import type { SettableAnnotation } from "./SettableAnnotation";
import type { CypherAnnotation } from "./CypherAnnotation";
import type { FullTextAnnotation } from "./FullTextAnnotation";
import type { LimitAnnotation } from "./LimitAnnotation";
import type { KeyAnnotation } from "./KeyAnnotation";
import type { AuthenticationAnnotation } from "./AuthenticationAnnotation";
import type { TimestampAnnotation } from "./TimestampAnnotation";
import type { FilterableAnnotation } from "./FilterableAnnotation";
import type { JWTClaimAnnotation } from "./JWTClaimAnnotation";
import type { QueryAnnotation } from "./QueryAnnotation";
import type { CoalesceAnnotation } from "./CoalesceAnnotation";
import type { SubscriptionsAuthorizationAnnotation } from "./SubscriptionsAuthorizationAnnotation";
import type { MutationAnnotation } from "./MutationAnnotation";
import type { UniqueAnnotation } from "./UniqueAnnotation";
export interface Annotation {
    readonly name: string;
}
type CheckAnnotationName<T> = {
    [P in keyof T]: T[P] & {
        name: P;
    };
};
export type Annotations = CheckAnnotationName<{
    private: PrivateAnnotation;
    plural: PluralAnnotation;
    customResolver: CustomResolverAnnotation;
    jwt: JWTPayloadAnnotation;
    selectable: SelectableAnnotation;
    populatedBy: PopulatedByAnnotation;
    subscription: SubscriptionAnnotation;
    authorization: AuthorizationAnnotation;
    default: DefaultAnnotation;
    settable: SettableAnnotation;
    cypher: CypherAnnotation;
    fulltext: FullTextAnnotation;
    limit: LimitAnnotation;
    id: IDAnnotation;
    key: KeyAnnotation;
    authentication: AuthenticationAnnotation;
    timestamp: TimestampAnnotation;
    filterable: FilterableAnnotation;
    jwtClaim: JWTClaimAnnotation;
    query: QueryAnnotation;
    coalesce: CoalesceAnnotation;
    subscriptionsAuthorization: SubscriptionsAuthorizationAnnotation;
    mutation: MutationAnnotation;
    relayId: RelayIDAnnotation;
    unique: UniqueAnnotation;
}>;
export type AnnotationParser<T extends Annotation> = (firstDirective: DirectiveNode, directives: readonly DirectiveNode[]) => T;
export declare const annotationsParsers: {
    [key in keyof Annotations]: AnnotationParser<Annotations[key]>;
};
export {};
