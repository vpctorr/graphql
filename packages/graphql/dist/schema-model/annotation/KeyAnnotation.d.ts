import type { Annotation } from "./Annotation";
export declare class KeyAnnotation implements Annotation {
    readonly name = "key";
    resolvable: boolean;
    constructor({ resolvable }: {
        resolvable?: boolean;
    });
}
