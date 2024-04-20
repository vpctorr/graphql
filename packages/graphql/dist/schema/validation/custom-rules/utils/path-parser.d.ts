import type { ASTNode, ObjectTypeDefinitionNode, FieldDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeExtensionNode, InterfaceTypeExtensionNode } from "graphql";
export type ObjectOrInterfaceWithExtensions = ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode | ObjectTypeExtensionNode | InterfaceTypeExtensionNode;
/**
 * This function is called with the path and ancestors arguments from a GraphQL visitor.
 * It parses the arguments to identify some information about the latest definitions traversed by the visitor.
 *
 * @returns [pathToHere, traversedDef, parentOfTraversedDef]
 *  * pathToHere is a list of the names of all definitions that were traversed by the visitor to get to the node that is being visited (not inclusive)
 *  * traversedDef is the last definition before the node that is being visited
 *  * parentOfTraversedDef is the parent of traversedDef
 */
export declare function getPathToNode(path: readonly (number | string)[], ancestors: readonly (ASTNode | readonly ASTNode[])[]): [
    Array<string>,
    ObjectOrInterfaceWithExtensions | FieldDefinitionNode | undefined,
    ObjectOrInterfaceWithExtensions | undefined
];
