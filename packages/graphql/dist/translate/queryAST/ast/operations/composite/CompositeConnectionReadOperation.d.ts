import Cypher from "@neo4j/cypher-builder";
import type { OperationTranspileResult } from "../operations";
import { Operation } from "../operations";
import { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import type { Pagination } from "../../pagination/Pagination";
import type { Sort, SortField } from "../../sort/Sort";
import type { CompositeConnectionPartial } from "./CompositeConnectionPartial";
export declare class CompositeConnectionReadOperation extends Operation {
    private children;
    protected sortFields: Array<{
        node: Sort[];
        edge: Sort[];
    }>;
    private pagination;
    constructor(children: CompositeConnectionPartial[]);
    transpile(context: QueryASTContext): OperationTranspileResult;
    addSort(sortElement: {
        node: Sort[];
        edge: Sort[];
    }): void;
    addPagination(pagination: Pagination): void;
    getChildren(): QueryASTNode[];
    protected getSortFields(context: QueryASTContext, nodeVar: Cypher.Variable | Cypher.Property, edgeVar: Cypher.Variable | Cypher.Property): SortField[];
}
