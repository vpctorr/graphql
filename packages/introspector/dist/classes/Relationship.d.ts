import type Property from "./Property";
type Path = {
    fromTypeId: string;
    toTypeId: string;
};
export default class Relationship {
    type: string;
    paths: Path[];
    properties: Property[];
    constructor(type: string);
    addProperty(property: Property): void;
    addPath(from: string, to: string): void;
}
export {};
