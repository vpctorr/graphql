import type { Annotation } from "./Annotation";
export type CoalesceAnnotationValue = string | number | boolean;
export declare class CoalesceAnnotation implements Annotation {
    readonly name = "coalesce";
    readonly value: CoalesceAnnotationValue;
    constructor({ value }: {
        value: CoalesceAnnotationValue;
    });
}
