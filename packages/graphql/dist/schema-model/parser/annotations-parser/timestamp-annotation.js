import { timestampDirective } from "../../../graphql/directives";
import { TimestampAnnotation } from "../../annotation/TimestampAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseTimestampAnnotation(directive) {
    const { operations } = parseArguments(timestampDirective, directive);
    if (operations.length === 0) {
        operations.push("CREATE", "UPDATE");
    }
    return new TimestampAnnotation({
        operations,
    });
}
