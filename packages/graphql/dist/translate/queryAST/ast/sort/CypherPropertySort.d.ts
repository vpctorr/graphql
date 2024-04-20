import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { CypherScalarOperation } from "../operations/CypherScalarOperation";
import type { SortField } from "./Sort";
import { Sort } from "./Sort";
export declare class CypherPropertySort extends Sort {
    private attribute;
    private direction;
    private cypherOperation;
    constructor({ attribute, direction, cypherOperation, }: {
        attribute: AttributeAdapter;
        direction: Cypher.Order;
        cypherOperation: CypherScalarOperation;
    });
    getChildren(): QueryASTNode[];
    print(): string;
    getFieldName(): string;
    getSortFields(context: QueryASTContext, _variable: Cypher.Variable | Cypher.Property, _sortByDatabaseName?: boolean): SortField[];
    getProjectionField(context: QueryASTContext): string | Record<string, Cypher.Expr>;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
}
