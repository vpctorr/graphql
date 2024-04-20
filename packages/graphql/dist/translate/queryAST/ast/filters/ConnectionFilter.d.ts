import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipWhereOperator } from "../../../where/types";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import { Filter } from "./Filter";
export declare class ConnectionFilter extends Filter {
    protected innerFilters: Filter[];
    protected relationship: RelationshipAdapter;
    protected target: ConcreteEntityAdapter | InterfaceEntityAdapter;
    protected operator: RelationshipWhereOperator;
    protected isNot: boolean;
    protected subqueryPredicate: Cypher.Predicate | undefined;
    constructor({ relationship, target, operator, isNot, }: {
        relationship: RelationshipAdapter;
        target: ConcreteEntityAdapter | InterfaceEntityAdapter;
        operator: RelationshipWhereOperator | undefined;
        isNot: boolean;
    });
    addFilters(filters: Filter[]): void;
    getChildren(): QueryASTNode[];
    print(): string;
    private getTargetNode;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    /**
     * Create a label predicate that filters concrete entities for interface target,
     * so that the same pattern matching can be used for all the concrete entities implemented by the interface entity.
     * Example:
     * MATCH (this:Actor)
     * WHERE EXISTS {
     *    MATCH (this)<-[this0:ACTED_IN]-(this1)
     *    WHERE (this1.title = $param0 AND (this1:Movie OR this1:Show)
     * }
     * RETURN this { .name } AS this
     **/
    protected getLabelPredicate(context: QueryASTContext): Cypher.Predicate | undefined;
    protected createRelationshipOperation(pattern: Cypher.Pattern, queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected createSingleRelationshipOperation(pattern: Cypher.Pattern, context: QueryASTContext, innerPredicate: Cypher.Predicate): Cypher.PredicateFunction;
    private getSubqueriesForDefaultOperations;
    private getSubqueriesForOperationAll;
    private wrapInNotIfNeeded;
}
