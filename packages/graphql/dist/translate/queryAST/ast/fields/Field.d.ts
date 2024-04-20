import type Cypher from "@neo4j/cypher-builder";
import { QueryASTNode } from "../QueryASTNode";
export declare abstract class Field extends QueryASTNode {
    alias: string;
    constructor(alias: string);
    abstract getProjectionField(variable: Cypher.Variable): string | Record<string, Cypher.Expr>;
    print(): string;
    isCypherField(): boolean;
}
