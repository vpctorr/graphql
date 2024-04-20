import type { Annotation } from "./Annotation";
export type FullTextField = {
    name?: string;
    fields: string[];
    queryName?: string;
    indexName: string;
};
export declare class FullTextAnnotation implements Annotation {
    readonly name = "fulltext";
    readonly indexes: FullTextField[];
    constructor({ indexes }: {
        indexes: FullTextField[];
    });
}
