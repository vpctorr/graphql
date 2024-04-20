import type { EnumTypeDefinitionNode, ArgumentNode, FieldDefinitionNode } from "graphql";
export declare function assertArgumentHasSameTypeAsField({ directiveName, traversedDef, argument, enums, }: {
    directiveName: string;
    traversedDef: FieldDefinitionNode;
    argument: ArgumentNode;
    enums: EnumTypeDefinitionNode[];
}): void;
