import type { DirectiveDefinitionNode, DirectiveNode, DocumentNode, EnumTypeDefinitionNode, InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, SchemaExtensionNode, UnionTypeDefinitionNode } from "graphql";
export type DefinitionCollection = {
    nodes: Map<string, ObjectTypeDefinitionNode>;
    scalarTypes: Map<string, ScalarTypeDefinitionNode>;
    enumTypes: Map<string, EnumTypeDefinitionNode>;
    interfaceTypes: Map<string, InterfaceTypeDefinitionNode>;
    unionTypes: Map<string, UnionTypeDefinitionNode>;
    directives: Map<string, DirectiveDefinitionNode>;
    relationshipProperties: Map<string, ObjectTypeDefinitionNode>;
    inputTypes: Map<string, InputObjectTypeDefinitionNode>;
    schemaExtension: SchemaExtensionNode | undefined;
    jwtPayload: ObjectTypeDefinitionNode | undefined;
    interfaceToImplementingTypeNamesMap: Map<string, string[]>;
    operations: ObjectTypeDefinitionNode[];
    schemaDirectives: DirectiveNode[];
    document: DocumentNode;
};
export declare function getDefinitionCollection(document: DocumentNode): DefinitionCollection;
