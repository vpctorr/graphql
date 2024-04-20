import type { Visitor } from "./types";
import type { Node } from "../../../classes";
import { UnwindASTNode } from "./UnwindASTNode";
export declare class CreateAST extends UnwindASTNode {
    nodeProperties: string[];
    node: Node;
    constructor(id: number, nodeProperties: string[], node: Node);
    accept<T>(visitor: Visitor<T>): T;
}
