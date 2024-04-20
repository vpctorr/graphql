import type { ObjectTypeDefinitionNode, FieldDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeExtensionNode, InterfaceTypeExtensionNode, GraphQLSchema } from "graphql";
export type ObjectOrInterfaceDefinitionNode = ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
export type ObjectOrInterfaceExtensionNode = ObjectTypeExtensionNode | InterfaceTypeExtensionNode;
type ObjectLikeDefinitionNode = ObjectOrInterfaceDefinitionNode | ObjectOrInterfaceExtensionNode;
export type DIRECTIVE_TRANSFORM_FN = (currentDirectiveDirective: any, typeName: string) => any;
export type CREATE_DIRECTIVE_DEFINITION_FN = (typeDefinitionName: string, schema: GraphQLSchema) => any;
export declare function containsDirective(object: ObjectLikeDefinitionNode, directiveName: string): boolean;
export declare function getDirectiveDefinition(typeDefinitionNode: ObjectLikeDefinitionNode | FieldDefinitionNode, directiveName: string): import("graphql").ConstDirectiveNode | undefined;
export {};
