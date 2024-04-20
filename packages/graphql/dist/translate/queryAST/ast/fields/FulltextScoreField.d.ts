import type Cypher from "@neo4j/cypher-builder";
import type { Variable } from "@neo4j/cypher-builder";
import type { QueryASTNode } from "../QueryASTNode";
import { Field } from "./Field";
export declare class FulltextScoreField extends Field {
    private score;
    constructor({ alias, score }: {
        alias: string;
        score: Cypher.Variable;
    });
    getProjectionField(_variable: Variable): Record<"score", Cypher.Variable>;
    getChildren(): QueryASTNode[];
}
