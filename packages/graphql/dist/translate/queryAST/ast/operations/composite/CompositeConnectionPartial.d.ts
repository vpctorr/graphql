import type { QueryASTContext } from "../../QueryASTContext";
import type { Pagination } from "../../pagination/Pagination";
import { ConnectionReadOperation } from "../ConnectionReadOperation";
import type { OperationTranspileResult } from "../operations";
export declare class CompositeConnectionPartial extends ConnectionReadOperation {
    transpile(context: QueryASTContext): OperationTranspileResult;
    addPagination(_pagination: Pagination): void;
}
