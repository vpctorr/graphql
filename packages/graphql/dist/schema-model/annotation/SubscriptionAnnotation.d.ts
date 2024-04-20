import type { SubscriptionEvent } from "../../graphql/directives/subscription";
import type { Annotation } from "./Annotation";
export declare class SubscriptionAnnotation implements Annotation {
    readonly name = "subscription";
    readonly events: Set<SubscriptionEvent>;
    constructor({ events }: {
        events: Set<SubscriptionEvent>;
    });
}
