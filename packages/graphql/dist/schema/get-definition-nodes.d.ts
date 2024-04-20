import type { DirectiveDefinitionNode, DocumentNode, EnumTypeDefinitionNode, InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, SchemaExtensionNode, UnionTypeDefinitionNode } from "graphql";
export type DefinitionNodes = {
    objectTypes: ObjectTypeDefinitionNode[];
    scalarTypes: ScalarTypeDefinitionNode[];
    enumTypes: EnumTypeDefinitionNode[];
    inputObjectTypes: InputObjectTypeDefinitionNode[];
    interfaceTypes: InterfaceTypeDefinitionNode[];
    directives: DirectiveDefinitionNode[];
    unionTypes: UnionTypeDefinitionNode[];
    schemaExtensions: SchemaExtensionNode[];
    operations: ObjectTypeDefinitionNode[];
};
export declare function getDefinitionNodes(document: DocumentNode): DefinitionNodes;
