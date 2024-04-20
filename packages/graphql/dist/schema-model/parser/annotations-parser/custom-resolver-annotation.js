import { customResolverDirective } from "../../../graphql/directives";
import { CustomResolverAnnotation } from "../../annotation/CustomResolverAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseCustomResolverAnnotation(directive) {
    const { requires } = parseArguments(customResolverDirective, directive);
    return new CustomResolverAnnotation({
        requires,
    });
}
