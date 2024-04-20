import type { Annotation } from "./Annotation";
export declare class TimestampAnnotation implements Annotation {
    readonly name = "timestamp";
    readonly operations: string[];
    constructor({ operations }: {
        operations: string[];
    });
}
