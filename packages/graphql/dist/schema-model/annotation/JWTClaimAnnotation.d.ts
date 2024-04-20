import type { Annotation } from "./Annotation";
export declare class JWTClaimAnnotation implements Annotation {
    readonly name = "jwtClaim";
    readonly path: string;
    constructor({ path }: {
        path: string;
    });
}
