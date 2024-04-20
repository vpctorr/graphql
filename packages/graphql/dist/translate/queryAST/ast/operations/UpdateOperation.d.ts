import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { ReadOperation } from "./ReadOperation";
import { Operation, type OperationTranspileResult } from "./operations";
/**
 * This is currently just a dummy tree node,
 * The whole mutation part is still implemented in the old way, the current scope of this node is just to contains the nested fields.
 **/
export declare class UpdateOperation extends Operation {
    readonly target: ConcreteEntityAdapter;
    projectionOperations: ReadOperation[];
    constructor({ target }: {
        target: ConcreteEntityAdapter;
    });
    getChildren(): QueryASTNode[];
    addProjectionOperations(operations: ReadOperation[]): void;
    transpile(context: QueryASTContext): OperationTranspileResult;
    private getProjectionClause;
}
