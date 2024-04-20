import type { DirectiveNode, ObjectTypeDefinitionNode } from "graphql";
import { LimitDirective } from "../../classes/LimitDirective";
export declare function parseLimitDirective({ directive, definition, }: {
    directive: DirectiveNode;
    definition: ObjectTypeDefinitionNode;
}): LimitDirective;
