import { parseArgumentsFromUnknownDirective } from "../parse-arguments";
import { SubscriptionsAuthorizationAnnotation, SubscriptionsAuthorizationFilterRule, } from "../../annotation/SubscriptionsAuthorizationAnnotation";
export function parseSubscriptionsAuthorizationAnnotation(directive) {
    const { filter } = parseArgumentsFromUnknownDirective(directive);
    const filterRules = filter?.map((rule) => new SubscriptionsAuthorizationFilterRule(rule));
    return new SubscriptionsAuthorizationAnnotation({
        filter: filterRules,
    });
}
