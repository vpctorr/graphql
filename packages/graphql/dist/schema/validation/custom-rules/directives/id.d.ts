import type { DirectiveNode, FieldDefinitionNode } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "../utils/path-parser";
export declare function verifyId({ directiveNode, traversedDef, }: {
    directiveNode: DirectiveNode;
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
}): void;
