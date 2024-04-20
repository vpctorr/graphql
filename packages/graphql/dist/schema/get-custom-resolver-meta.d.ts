import type { IResolvers } from "@graphql-tools/utils";
import type { FieldDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, DocumentNode, UnionTypeDefinitionNode } from "graphql";
import type { ResolveTree } from "graphql-parse-resolve-info";
type CustomResolverMeta = {
    requiredFields: Record<string, ResolveTree>;
};
export declare const INVALID_REQUIRED_FIELD_ERROR: string;
export declare const INVALID_SELECTION_SET_ERROR = "Invalid selection set passed to @customResolver required";
export declare function getCustomResolverMeta({ field, object, objects, interfaces, unions, customResolvers, interfaceField, }: {
    field: FieldDefinitionNode;
    object: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
    objects: ObjectTypeDefinitionNode[];
    interfaces: InterfaceTypeDefinitionNode[];
    unions: UnionTypeDefinitionNode[];
    customResolvers?: IResolvers | IResolvers[];
    interfaceField?: FieldDefinitionNode;
}): CustomResolverMeta | undefined;
export declare function selectionSetToResolveTree(objectFields: ReadonlyArray<FieldDefinitionNode>, objects: ObjectTypeDefinitionNode[], interfaces: InterfaceTypeDefinitionNode[], unions: UnionTypeDefinitionNode[], document: DocumentNode): Record<string, ResolveTree>;
export {};
