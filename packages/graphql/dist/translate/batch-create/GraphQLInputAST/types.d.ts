import type { CreateAST } from "./CreateAST";
import type { NestedCreateAST } from "./NestedCreateAST";
export interface Visitor<T = void> {
    visitCreate: (create: CreateAST) => T;
    visitNestedCreate: (nestedCreate: NestedCreateAST) => T;
}
