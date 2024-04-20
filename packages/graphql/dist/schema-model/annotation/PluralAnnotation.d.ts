import type { Annotation } from "./Annotation";
export declare class PluralAnnotation implements Annotation {
    readonly name = "plural";
    readonly value: string;
    constructor({ value }: {
        value: string;
    });
}
