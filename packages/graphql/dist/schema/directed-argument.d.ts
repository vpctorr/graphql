import type { RelationshipAdapter } from "../schema-model/relationship/model-adapters/RelationshipAdapter";
import { RelationshipDeclarationAdapter } from "../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
type DirectedArgument = {
    type: "Boolean";
    defaultValue: boolean;
};
export declare function getDirectedArgument(relationshipAdapter: RelationshipAdapter): DirectedArgument | undefined;
export declare function addDirectedArgument<T extends Record<string, any>>(args: T, relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter): T & {
    directed?: DirectedArgument;
};
export {};
