import Cypher from "@neo4j/cypher-builder";
/** Asserts the given variable is a Cypher.Node instance */
export declare function assertIsCypherNode(variable: Cypher.Variable): asserts variable is Cypher.Node;
