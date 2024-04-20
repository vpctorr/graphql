import type { DirectiveNode, FieldDefinitionNode, EnumTypeDefinitionNode } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "../utils/path-parser";
export declare function verifyDefault(enums: EnumTypeDefinitionNode[]): ({ directiveNode, traversedDef, }: {
    directiveNode: DirectiveNode;
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
}) => void;
