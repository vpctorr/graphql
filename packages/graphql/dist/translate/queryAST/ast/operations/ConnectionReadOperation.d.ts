import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { Field } from "../fields/Field";
import type { Filter } from "../filters/Filter";
import type { AuthorizationFilters } from "../filters/authorization-filters/AuthorizationFilters";
import type { Pagination } from "../pagination/Pagination";
import type { EntitySelection } from "../selection/EntitySelection";
import type { Sort } from "../sort/Sort";
import type { OperationTranspileResult } from "./operations";
import { Operation } from "./operations";
export declare class ConnectionReadOperation extends Operation {
    readonly relationship: RelationshipAdapter | undefined;
    readonly target: ConcreteEntityAdapter;
    nodeFields: Field[];
    edgeFields: Field[];
    protected filters: Filter[];
    protected pagination: Pagination | undefined;
    protected sortFields: Array<{
        node: Sort[];
        edge: Sort[];
    }>;
    protected authFilters: AuthorizationFilters[];
    protected selection: EntitySelection;
    constructor({ relationship, target, selection, }: {
        relationship: RelationshipAdapter | undefined;
        target: ConcreteEntityAdapter;
        selection: EntitySelection;
    });
    setNodeFields(fields: Field[]): void;
    addFilters(...filters: Filter[]): void;
    setEdgeFields(fields: Field[]): void;
    addAuthFilters(...filter: AuthorizationFilters[]): void;
    addSort(sortElement: {
        node: Sort[];
        edge: Sort[];
    }): void;
    addPagination(pagination: Pagination): void;
    getChildren(): QueryASTNode[];
    transpile(context: QueryASTContext): OperationTranspileResult;
    protected getAuthFilterSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getFilterSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getAuthFilterPredicate(context: QueryASTContext): Cypher.Predicate[];
    private createUnwindAndProjectionSubquery;
    private createProjectionMapForEdge;
    private generateProjectionMapForFields;
    private generateSortAndPaginationClause;
    private addPaginationSubclauses;
    private addSortSubclause;
    private addFiltersToClause;
    private getSortFields;
    /**
     *  This method resolves all the subqueries for each field and splits them into separate fields: `prePaginationSubqueries` and `postPaginationSubqueries`,
     *  in the `prePaginationSubqueries` are present all the subqueries required for the pagination purpose.
     **/
    private getPreAndPostSubqueries;
}
