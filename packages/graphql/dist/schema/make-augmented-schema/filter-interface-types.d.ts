import type { InterfaceTypeDefinitionNode } from "graphql";
export declare function filterInterfaceTypes(interfaceTypes: InterfaceTypeDefinitionNode[], interfaceRelationshipNames: Set<string>): {
    interfaceRelationships: InterfaceTypeDefinitionNode[];
    filteredInterfaceTypes: InterfaceTypeDefinitionNode[];
};
