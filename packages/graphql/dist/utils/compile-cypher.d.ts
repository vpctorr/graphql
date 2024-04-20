import type Cypher from "@neo4j/cypher-builder";
/** Compiles the cypher of an element, if the resulting cypher is not empty adds a prefix */
export declare function compileCypherIfExists(element: Cypher.Expr | Cypher.Clause | undefined, env: Cypher.Environment): string;
/** Compiles the cypher of an element, if the resulting cypher is not empty adds a prefix */
export declare function compileCypher(element: Cypher.Expr | Cypher.Clause, env: Cypher.Environment): string;
