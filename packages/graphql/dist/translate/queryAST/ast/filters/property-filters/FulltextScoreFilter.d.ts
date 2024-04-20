import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { Filter } from "../Filter";
/** A property which comparison has already been parsed into a Param */
export declare class FulltextScoreFilter extends Filter {
    private scoreVariable;
    private min?;
    private max?;
    constructor({ scoreVariable, min, max }: {
        scoreVariable: Cypher.Variable;
        min?: number;
        max?: number;
    });
    getChildren(): QueryASTNode[];
    getPredicate(_queryASTContext: QueryASTContext): Cypher.Predicate;
}
