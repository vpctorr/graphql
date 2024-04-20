import type { Annotation } from "./Annotation";
export declare class PopulatedByAnnotation implements Annotation {
    readonly name = "populatedBy";
    readonly callback: string;
    readonly operations: string[];
    constructor({ callback, operations }: {
        callback: string;
        operations: string[];
    });
}
