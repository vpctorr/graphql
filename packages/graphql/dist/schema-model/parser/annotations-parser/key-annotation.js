import { Neo4jGraphQLSchemaValidationError } from "../../../classes";
import { KeyAnnotation } from "../../annotation/KeyAnnotation";
import { parseArgumentsFromUnknownDirective } from "../parse-arguments";
export function parseKeyAnnotation(_, directives) {
    let isResolvable = false;
    directives.forEach((directive) => {
        // fields is a recognized argument but we don't use it, hence we ignore the non-usage of the variable.
        const { fields, resolvable, ...unrecognizedArguments } = parseArgumentsFromUnknownDirective(directive);
        if (Object.keys(unrecognizedArguments).length) {
            throw new Neo4jGraphQLSchemaValidationError(`@key unrecognized arguments: ${Object.keys(unrecognizedArguments).join(", ")}`);
        }
        isResolvable = isResolvable || resolvable;
    });
    return new KeyAnnotation({
        resolvable: isResolvable,
    });
}
