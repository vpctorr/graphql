import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import type { FilterOperator } from "../Filter";
import { Filter } from "../Filter";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare class PropertyFilter extends Filter {
    protected attribute: AttributeAdapter;
    protected relationship: RelationshipAdapter | undefined;
    protected comparisonValue: unknown;
    protected operator: FilterOperator;
    protected isNot: boolean;
    protected attachedTo: "node" | "relationship";
    constructor({ attribute, relationship, comparisonValue, operator, isNot, attachedTo, }: {
        attribute: AttributeAdapter;
        relationship?: RelationshipAdapter;
        comparisonValue: unknown;
        operator: FilterOperator;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
    });
    getChildren(): QueryASTNode[];
    print(): string;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate;
    private getPropertyRefOrAliasesCase;
    private getAliasesToResolve;
    private generateCaseForAliasedFields;
    private getPropertyRef;
    /** Returns the operation for a given filter.
     * To be overridden by subclasses
     */
    protected getOperation(prop: Cypher.Property | Cypher.Case): Cypher.ComparisonOp;
    /** Returns the default operation for a given filter */
    protected createBaseOperation({ operator, property, param, }: {
        operator: FilterOperator;
        property: Cypher.Expr;
        param: Cypher.Expr;
    }): Cypher.ComparisonOp;
    protected coalesceValueIfNeeded(expr: Cypher.Expr): Cypher.Expr;
    private getNullPredicate;
    private wrapInNotIfNeeded;
}
