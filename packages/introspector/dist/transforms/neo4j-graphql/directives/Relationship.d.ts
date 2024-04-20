import type { Direction, Directive } from "../types";
export declare class RelationshipDirective implements Directive {
    direction: Direction;
    type: string;
    propertiesReference?: string;
    constructor(type: string, direction: Direction, propertiesReference?: string);
    toString(): string;
}
