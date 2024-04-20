import { uniqueDirective } from "../../../graphql/directives";
import { UniqueAnnotation } from "../../annotation/UniqueAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseUniqueAnnotation(directive) {
    const { constraintName } = parseArguments(uniqueDirective, directive);
    return new UniqueAnnotation({
        constraintName,
    });
}
