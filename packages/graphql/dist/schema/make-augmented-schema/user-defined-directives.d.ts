import type { DirectiveNode } from "graphql";
import type { DefinitionNodes } from "../get-definition-nodes";
export declare function getUserDefinedDirectives(definitionNodes: DefinitionNodes): {
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
    userDefinedDirectivesForNode: Map<string, DirectiveNode[]>;
    propagatedDirectivesForNode: Map<string, DirectiveNode[]>;
    userDefinedDirectivesForInterface: Map<string, DirectiveNode[]>;
    userDefinedDirectivesForUnion: Map<string, DirectiveNode[]>;
};
