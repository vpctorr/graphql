import type { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "./InterfaceEntityAdapter";
export type RootTypeFieldNames = {
    create: string;
    connection: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
};
type AggregateTypeNames = {
    selection: string;
    input: string;
};
type MutationResponseTypeNames = {
    create: string;
    update: string;
};
type SubscriptionEvents = {
    create: string;
    update: string;
    delete: string;
    create_relationship: string;
    delete_relationship: string;
};
export type UpdateMutationArgumentNames = {
    connect: string;
    disconnect: string;
    create: string;
    update: string;
    delete: string;
    connectOrCreate: string;
    where: string;
};
export type CreateMutationArgumentNames = {
    input: string;
};
/** ImplementingType refers to the common abstraction of an ObjectType (ConcreteEntity) and InterfaceType */
export declare class ImplementingEntityOperations<T extends InterfaceEntityAdapter | ConcreteEntityAdapter> {
    protected readonly pascalCasePlural: string;
    protected readonly pascalCaseSingular: string;
    protected readonly entityAdapter: T;
    constructor(entityAdapter: T);
    get whereInputTypeName(): string;
    get uniqueWhereInputTypeName(): string;
    get connectOrCreateWhereInputTypeName(): string;
    get connectWhereInputTypeName(): string;
    get createInputTypeName(): string;
    get updateInputTypeName(): string;
    get deleteInputTypeName(): string;
    get optionsInputTypeName(): string;
    get sortInputTypeName(): string;
    get relationInputTypeName(): string;
    get connectInputTypeName(): string;
    get connectOrCreateInputTypeName(): string;
    get disconnectInputTypeName(): string;
    get onCreateInputTypeName(): string;
    get subscriptionWhereInputTypeName(): string;
    get subscriptionEventPayloadTypeName(): string;
    get implementationsSubscriptionWhereInputTypeName(): string;
    getAggregationFieldTypename(): string;
    get rootTypeFieldNames(): RootTypeFieldNames;
    get aggregateTypeNames(): AggregateTypeNames;
    get mutationResponseTypeNames(): MutationResponseTypeNames;
    get subscriptionEventTypeNames(): SubscriptionEvents;
    get subscriptionEventPayloadFieldNames(): SubscriptionEvents;
    get updateMutationArgumentNames(): UpdateMutationArgumentNames;
    get createMutationArgumentNames(): CreateMutationArgumentNames;
    get connectOrCreateWhereInputFieldNames(): {
        node: string;
    };
}
export {};
