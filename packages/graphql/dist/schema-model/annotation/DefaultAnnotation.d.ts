import type { Annotation } from "./Annotation";
export type DefaultAnnotationValue = string | number | boolean;
export declare class DefaultAnnotation implements Annotation {
    readonly name = "default";
    readonly value: DefaultAnnotationValue;
    constructor({ value }: {
        value: DefaultAnnotationValue;
    });
}
