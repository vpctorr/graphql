import type { Visitor } from "./types";
export declare abstract class UnwindASTNode {
    id: number;
    children: UnwindASTNode[];
    constructor(id: number);
    addChildren(node: UnwindASTNode): void;
    abstract accept<T>(visitor: Visitor<T>): T;
}
