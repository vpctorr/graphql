import type { Visitor } from "./types";
import { UnwindASTNode } from "./UnwindASTNode";
import type { Node, Relationship } from "../../../classes";
import type { RelationField } from "../../../types";
export declare class NestedCreateAST extends UnwindASTNode {
    node: Node;
    parent: Node;
    nodeProperties: string[];
    edgeProperties: string[];
    relationshipPropertyPath: string;
    relationship: [RelationField | undefined, Node[]];
    edge: Relationship | undefined;
    constructor(id: number, node: Node, parent: Node, nodeProperties: string[], edgeProperties: string[], relationshipPropertyPath: string, relationship: [RelationField | undefined, Node[]], edge?: Relationship);
    accept<T>(visitor: Visitor<T>): T;
}
