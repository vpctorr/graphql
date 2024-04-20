import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipWhereOperator } from "../../../where/types";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import { Filter } from "./Filter";
export declare class RelationshipFilter extends Filter {
    protected targetNodeFilters: Filter[];
    protected relationship: RelationshipAdapter;
    protected operator: RelationshipWhereOperator;
    protected isNot: boolean;
    protected target: ConcreteEntityAdapter | InterfaceEntityAdapter;
    protected subqueryPredicate: Cypher.Predicate | undefined;
    /** Variable to be used if relationship need to get the count (i.e. 1-1 relationships) */
    protected countVariable: Cypher.Variable;
    constructor({ relationship, operator, isNot, target, }: {
        relationship: RelationshipAdapter;
        operator: RelationshipWhereOperator;
        isNot: boolean;
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
    });
    getChildren(): QueryASTNode[];
    addTargetNodeFilter(...filter: Filter[]): void;
    print(): string;
    protected getNestedContext(context: QueryASTContext): QueryASTContext;
    protected getNestedSelectionSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    protected getNestedSubqueries(context: QueryASTContext): Cypher.Clause[];
    private getSubqueryForAllFilter;
    private getNestedSubqueryFilter;
    protected shouldCreateOptionalMatch(): boolean;
    getSelection(queryASTContext: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected getSingleRelationshipOperation({ pattern, queryASTContext, innerPredicate, }: {
        pattern: Cypher.Pattern;
        queryASTContext: QueryASTContext;
        innerPredicate: Cypher.Predicate;
    }): Cypher.Predicate;
    protected createRelationshipOperation(pattern: Cypher.Pattern, queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected wrapInNotIfNeeded(predicate: Cypher.Predicate): Cypher.Predicate;
}
