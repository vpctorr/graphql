import type { DirectiveNode, EnumTypeDefinitionNode, FieldDefinitionNode, InterfaceTypeDefinitionNode, InterfaceTypeExtensionNode, ObjectTypeDefinitionNode, UnionTypeDefinitionNode } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "../utils/path-parser";
export declare function verifyRelationshipArgumentValue(objectTypeToRelationshipsPerRelationshipTypeMap: Map<string, Map<string, [string, string, string][]>>, interfaceToImplementationsMap: Map<string, Set<string>>, extra?: {
    enums: EnumTypeDefinitionNode[];
    interfaces: (InterfaceTypeDefinitionNode | InterfaceTypeExtensionNode)[];
    unions: UnionTypeDefinitionNode[];
    objects: ObjectTypeDefinitionNode[];
}): ({ directiveNode, traversedDef, parentDef, }: {
    directiveNode: DirectiveNode;
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
    parentDef?: ObjectOrInterfaceWithExtensions | undefined;
}) => void;
