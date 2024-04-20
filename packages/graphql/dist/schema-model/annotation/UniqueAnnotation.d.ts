import type { Annotation } from "./Annotation";
export declare class UniqueAnnotation implements Annotation {
    readonly name = "unique";
    readonly constraintName?: string;
    constructor({ constraintName }: {
        constraintName?: string;
    });
}
