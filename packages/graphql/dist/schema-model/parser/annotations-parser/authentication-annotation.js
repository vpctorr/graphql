import { AuthenticationAnnotation } from "../../annotation/AuthenticationAnnotation";
import { parseArgumentsFromUnknownDirective } from "../parse-arguments";
const authenticationDefaultOperations = [
    "READ",
    "AGGREGATE",
    "CREATE",
    "UPDATE",
    "DELETE",
    "CREATE_RELATIONSHIP",
    "DELETE_RELATIONSHIP",
    "SUBSCRIBE",
];
export function parseAuthenticationAnnotation(directive) {
    const args = parseArgumentsFromUnknownDirective(directive);
    const constructorArgs = [
        args.operations || authenticationDefaultOperations,
    ];
    if (args.jwt) {
        constructorArgs.push(args.jwt);
    }
    return new AuthenticationAnnotation(...constructorArgs);
}
