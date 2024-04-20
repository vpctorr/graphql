import type Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "./QueryASTContext";
export declare abstract class QueryASTNode {
    abstract getChildren(): QueryASTNode[];
    /** Prints the name of the Node */
    print(): string;
    getSubqueries(_context: QueryASTContext): Cypher.Clause[];
    getSelection(_context: QueryASTContext): Array<Cypher.Match | Cypher.With>;
}
