import type { DocumentNode, GraphQLSchema, TypeDefinitionNode, DirectiveDefinitionNode, ObjectTypeExtensionNode, InterfaceTypeExtensionNode } from "graphql";
type DefinitionNodeMap = Record<string, TypeDefinitionNode | DirectiveDefinitionNode | ObjectTypeExtensionNode[] | InterfaceTypeExtensionNode[]>;
export declare class EnricherContext {
    augmentedSchema: GraphQLSchema;
    userDefinitionNodeMap: DefinitionNodeMap;
    constructor(userDocument: DocumentNode, augmentedDocument: DocumentNode);
    buildDefinitionsNodeMap(documentNode: DocumentNode): DefinitionNodeMap;
}
export {};
