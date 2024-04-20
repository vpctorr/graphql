import type { Node } from "../classes";
export declare function findConflictingProperties({ node, input, }: {
    node: Node;
    input: Record<string, any> | undefined;
}): string[];
