import type { DirectiveNode } from "graphql";
import type { Callback, Neo4jGraphQLCallbacks } from "../types";
export declare function getPopulatedByMeta(directive: DirectiveNode, callbacks?: Neo4jGraphQLCallbacks): Callback;
