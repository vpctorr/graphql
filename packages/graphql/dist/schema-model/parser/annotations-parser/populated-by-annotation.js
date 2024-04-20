import { populatedByDirective } from "../../../graphql/directives";
import { PopulatedByAnnotation } from "../../annotation/PopulatedByAnnotation";
import { parseArguments } from "../parse-arguments";
export function parsePopulatedByAnnotation(directive) {
    const { callback, operations } = parseArguments(populatedByDirective, directive);
    return new PopulatedByAnnotation({
        callback,
        operations,
    });
}
