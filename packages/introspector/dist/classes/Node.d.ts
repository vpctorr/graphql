import type Property from "./Property";
import type Relationship from "./Relationship";
export default class Node {
    typeId: string;
    labels: string[];
    properties: Property[];
    relationships: Relationship[];
    constructor(typeId: string, labels: string[]);
    addProperty(property: Property): void;
    addRelationship(relationship: Relationship): void;
}
