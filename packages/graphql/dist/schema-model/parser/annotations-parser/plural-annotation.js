import { pluralDirective } from "../../../graphql/directives";
import { PluralAnnotation } from "../../annotation/PluralAnnotation";
import { parseArguments } from "../parse-arguments";
export function parsePluralAnnotation(directive) {
    const { value } = parseArguments(pluralDirective, directive);
    return new PluralAnnotation({
        value,
    });
}
