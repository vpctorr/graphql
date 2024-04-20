import Cypher from "@neo4j/cypher-builder";
import { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import { CypherOperation } from "../operations/CypherOperation";
import { CypherScalarOperation } from "../operations/CypherScalarOperation";
import { CompositeCypherOperation } from "../operations/composite/CompositeCypherOperation";
import type { Operation } from "../operations/operations";
import { Field } from "./Field";
export declare class OperationField extends Field {
    operation: Operation;
    private projectionExpr;
    constructor({ operation, alias }: {
        operation: Operation;
        alias: string;
    });
    getChildren(): QueryASTNode[];
    getProjectionField(): Record<string, Cypher.Expr>;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    isCypherField(): this is this & {
        operation: CypherOperation | CypherScalarOperation | CompositeCypherOperation;
    };
}
