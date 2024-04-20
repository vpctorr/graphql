import type { Annotation } from "./Annotation";
export declare class FilterableAnnotation implements Annotation {
    readonly name = "filterable";
    readonly byValue: boolean;
    readonly byAggregate: boolean;
    constructor({ byValue, byAggregate }: {
        byValue: boolean;
        byAggregate: boolean;
    });
}
