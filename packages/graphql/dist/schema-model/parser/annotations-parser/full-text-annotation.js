import { fulltextDirective } from "../../../graphql/directives";
import { FullTextAnnotation } from "../../annotation/FullTextAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseFullTextAnnotation(directive) {
    const { indexes } = parseArguments(fulltextDirective, directive);
    return new FullTextAnnotation({
        indexes,
    });
}
