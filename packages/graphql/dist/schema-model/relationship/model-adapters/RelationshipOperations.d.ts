import type { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "./RelationshipAdapter";
import { RelationshipBaseOperations } from "./RelationshipBaseOperations";
export declare class RelationshipOperations extends RelationshipBaseOperations<RelationshipAdapter> {
    constructor(relationship: RelationshipAdapter);
    protected get fieldInputPrefixForTypename(): string;
    protected get edgePrefix(): string;
    get subscriptionWhereInputTypeName(): string;
    getToUnionSubscriptionWhereInputTypeName(ifUnionRelationshipTargetEntity: ConcreteEntityAdapter): string;
    get subscriptionConnectedRelationshipTypeName(): string;
    get edgeSubscriptionWhereInputTypeName(): string;
}
