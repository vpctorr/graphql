import type { ASTNode } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "./path-parser";
export declare function hydrateInterfaceWithImplementedTypesMap(node: ASTNode, interfaceToImplementingTypes: Map<string, Set<string>>): void;
export declare function getInheritedTypeNames(mainType: ObjectOrInterfaceWithExtensions, interfaceToImplementingTypes: Map<string, Set<string>>): string[];
