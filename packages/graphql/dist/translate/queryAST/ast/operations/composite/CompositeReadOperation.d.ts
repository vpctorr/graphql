import Cypher from "@neo4j/cypher-builder";
import type { InterfaceEntityAdapter } from "../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import type { Pagination } from "../../pagination/Pagination";
import type { Sort, SortField } from "../../sort/Sort";
import type { OperationTranspileResult } from "../operations";
import { Operation } from "../operations";
import type { CompositeReadPartial } from "./CompositeReadPartial";
export declare class CompositeReadOperation extends Operation {
    private children;
    private entity;
    private relationship;
    protected pagination: Pagination | undefined;
    protected sortFields: Sort[];
    constructor({ compositeEntity, children, relationship, }: {
        compositeEntity: InterfaceEntityAdapter | UnionEntityAdapter;
        children: CompositeReadPartial[];
        relationship: RelationshipAdapter | undefined;
    });
    getChildren(): QueryASTNode[];
    transpile(context: QueryASTContext): OperationTranspileResult;
    addPagination(pagination: Pagination): void;
    addSort(...sortElement: Sort[]): void;
    protected getSortFields(context: QueryASTContext, target: Cypher.Variable): SortField[];
}
