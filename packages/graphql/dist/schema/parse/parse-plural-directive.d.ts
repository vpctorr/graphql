import type { DirectiveNode } from "graphql";
/**
 * Parse the plural directive and return the plural value.
 * @param pluralDirective The plural directicve to parse.
 * @returns The plural value.
 */
export default function parsePluralDirective(pluralDirective: DirectiveNode | undefined): string | undefined;
