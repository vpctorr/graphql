import { subscriptionDirective } from "../../../graphql/directives";
import { SubscriptionAnnotation } from "../../annotation/SubscriptionAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseSubscriptionAnnotation(directive) {
    const { events } = parseArguments(subscriptionDirective, directive);
    return new SubscriptionAnnotation({
        events: new Set(events),
    });
}
