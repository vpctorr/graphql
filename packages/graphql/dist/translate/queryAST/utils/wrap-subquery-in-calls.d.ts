import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../ast/QueryASTContext";
import type { QueryASTNode } from "../ast/QueryASTNode";
/** Gets subqueries from fields and map these to Call statements with inner target */
export declare function wrapSubqueriesInCypherCalls(context: QueryASTContext, fields: QueryASTNode[], withArgs?: Cypher.Variable[]): Cypher.Clause[];
