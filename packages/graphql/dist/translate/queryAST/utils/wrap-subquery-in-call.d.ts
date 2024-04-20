import Cypher from "@neo4j/cypher-builder";
/** Wraps provided queries in Call statements with inner target */
export declare function wrapSubqueryInCall(subquery: Cypher.Clause, target: Cypher.Variable): Cypher.Call;
