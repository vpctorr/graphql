import type { Directive } from "./types";
export declare class NodeField {
    name: string;
    type: string;
    directives: Directive[];
    constructor(name: string, type: string);
    addDirective(d: Directive): void;
    toString(): string;
}
