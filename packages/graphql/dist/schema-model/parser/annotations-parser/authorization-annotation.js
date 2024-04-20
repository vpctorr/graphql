import { AuthorizationAnnotation, AuthorizationFilterRule, AuthorizationValidateRule, } from "../../annotation/AuthorizationAnnotation";
import { parseArgumentsFromUnknownDirective } from "../parse-arguments";
export function parseAuthorizationAnnotation(directive) {
    const { filter, validate } = parseArgumentsFromUnknownDirective(directive);
    const filterRules = filter?.map((rule) => new AuthorizationFilterRule(rule));
    const validateRules = validate?.map((rule) => new AuthorizationValidateRule(rule));
    return new AuthorizationAnnotation({
        filter: filterRules,
        validate: validateRules,
    });
}
