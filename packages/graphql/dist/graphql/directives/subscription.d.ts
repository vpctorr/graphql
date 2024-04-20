import { GraphQLDirective } from "graphql";
export declare enum SubscriptionEvent {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
    RELATIONSHIP_CREATED = "RELATIONSHIP_CREATED",
    RELATIONSHIP_DELETED = "RELATIONSHIP_DELETED"
}
export declare const subscriptionDirective: GraphQLDirective;
