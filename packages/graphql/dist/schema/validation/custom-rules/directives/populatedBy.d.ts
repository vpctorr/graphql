import type { DirectiveNode } from "graphql";
import type { Neo4jGraphQLCallbacks } from "../../../../types";
export declare function verifyPopulatedBy(callbacks?: Neo4jGraphQLCallbacks): ({ directiveNode }: {
    directiveNode: DirectiveNode;
}) => void;
