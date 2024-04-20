import { jwtClaim } from "../../../graphql/directives";
import { JWTClaimAnnotation } from "../../annotation/JWTClaimAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseJWTClaimAnnotation(directive) {
    const { path } = parseArguments(jwtClaim, directive);
    return new JWTClaimAnnotation({
        path,
    });
}
