import { Neo4jGraphQLSchemaValidationError } from "../../../classes";
import { MutationAnnotation } from "../../annotation/MutationAnnotation";
import { mutationDirective } from "../../../graphql/directives";
import { parseArguments } from "../parse-arguments";
export function parseMutationAnnotation(directive) {
    const { operations } = parseArguments(mutationDirective, directive);
    if (!Array.isArray(operations)) {
        throw new Neo4jGraphQLSchemaValidationError("@mutation operations must be an array");
    }
    return new MutationAnnotation({
        operations: new Set(operations),
    });
}
