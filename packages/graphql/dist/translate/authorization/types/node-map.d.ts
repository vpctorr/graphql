import type Cypher from "@neo4j/cypher-builder";
import type { Node } from "../../../types";
export type NodeMap = {
    node: Node;
    variable: Cypher.Node;
    fieldName?: string;
};
