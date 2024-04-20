import type { Annotation } from "./Annotation";
export declare class LimitAnnotation implements Annotation {
    readonly name = "limit";
    default?: number;
    max?: number;
    constructor({ default: _default, max }: {
        default?: number;
        max?: number;
    });
}
