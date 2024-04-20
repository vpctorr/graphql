import type { Annotation } from "./Annotation";
export declare class QueryAnnotation implements Annotation {
    readonly name = "query";
    readonly read: boolean;
    readonly aggregate: boolean;
    constructor({ read, aggregate }: {
        read: boolean;
        aggregate: boolean;
    });
}
