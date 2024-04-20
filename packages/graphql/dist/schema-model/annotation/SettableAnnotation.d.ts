import type { Annotation } from "./Annotation";
export declare class SettableAnnotation implements Annotation {
    readonly name = "settable";
    readonly onCreate: boolean;
    readonly onUpdate: boolean;
    constructor({ onCreate, onUpdate }: {
        onCreate: boolean;
        onUpdate: boolean;
    });
}
