import type Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../QueryASTContext";
import { QueryASTNode } from "../QueryASTNode";
export type SelectionClause = Cypher.Match | Cypher.With | Cypher.Yield;
export declare abstract class EntitySelection extends QueryASTNode {
    getChildren(): QueryASTNode[];
    /** Apply selection over the given context, returns the updated context and the selection clause
     * TODO: Improve naming */
    abstract apply(context: QueryASTContext): {
        nestedContext: QueryASTContext<Cypher.Node>;
        selection: SelectionClause;
    };
}
