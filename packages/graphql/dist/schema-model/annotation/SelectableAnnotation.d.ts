import type { Annotation } from "./Annotation";
export declare class SelectableAnnotation implements Annotation {
    readonly name = "selectable";
    readonly onRead: boolean;
    readonly onAggregate: boolean;
    constructor({ onRead, onAggregate }: {
        onRead: boolean;
        onAggregate: boolean;
    });
}
