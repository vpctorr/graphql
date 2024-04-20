import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import { QueryASTNode } from "../../QueryASTNode";
import type { AuthorizationFilters } from "../../filters/authorization-filters/AuthorizationFilters";
export declare class CompositeAggregationPartial extends QueryASTNode {
    readonly entity?: RelationshipAdapter;
    readonly target: ConcreteEntityAdapter;
    protected directed: boolean;
    protected attachedTo: "node" | "relationship";
    protected authFilters: AuthorizationFilters[];
    constructor({ target, entity, directed, attachedTo, }: {
        target: ConcreteEntityAdapter;
        entity?: RelationshipAdapter;
        directed?: boolean;
        attachedTo?: "node" | "relationship";
    });
    getChildren(): QueryASTNode[];
    addAuthFilters(...filter: AuthorizationFilters[]): void;
    protected getAuthFilterPredicate(context: QueryASTContext): Cypher.Predicate[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    print(): string;
    setAttachedTo(attachedTo: "node" | "relationship"): void;
}
