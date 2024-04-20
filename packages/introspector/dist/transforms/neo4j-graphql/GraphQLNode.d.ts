import type { Directive } from "./types";
import type { NodeField } from "./NodeField";
type NodeType = "type" | "interface";
export declare class GraphQLNode {
    type: NodeType;
    typeName: string;
    fields: NodeField[];
    directives: Directive[];
    constructor(type: NodeType, typeName: string);
    addDirective(d: Directive): void;
    addField(field: NodeField): void;
    toString(): string;
}
export {};
