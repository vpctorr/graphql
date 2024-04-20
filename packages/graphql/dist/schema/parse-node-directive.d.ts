import type { DirectiveNode } from "graphql";
import { NodeDirective } from "../classes/NodeDirective";
declare function parseNodeDirective(nodeDirective: DirectiveNode | undefined): NodeDirective;
export default parseNodeDirective;