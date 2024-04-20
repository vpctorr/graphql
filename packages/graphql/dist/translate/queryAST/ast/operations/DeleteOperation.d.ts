import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { Filter } from "../filters/Filter";
import type { EntitySelection } from "../selection/EntitySelection";
import type { OperationTranspileResult } from "./operations";
import { MutationOperation } from "./operations";
export declare class DeleteOperation extends MutationOperation {
    readonly target: ConcreteEntityAdapter | InterfaceEntityAdapter;
    private selection;
    private filters;
    private authFilters;
    private nestedOperations;
    constructor({ target, selection, nestedOperations, filters, authFilters, }: {
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
        selection: EntitySelection;
        filters?: Filter[];
        nestedOperations?: DeleteOperation[];
        authFilters?: Filter[];
    });
    getChildren(): QueryASTNode[];
    transpile(context: QueryASTContext): OperationTranspileResult;
    private transpileTopLevel;
    private transpileNested;
    private appendDeleteClause;
    private getLastClause;
    private appendFilters;
    private getNestedDeleteSubQueries;
    private validateSelection;
    private getPredicate;
    private getAuthFilterSubqueries;
    private getAuthFilterPredicate;
    private getExtraSelections;
}
