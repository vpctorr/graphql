import type { UnionEntityAdapter } from "./UnionEntityAdapter";
type RootTypeFieldNames = {
    read: string;
};
export declare class UnionEntityOperations {
    private readonly unionEntityAdapter;
    constructor(unionEntityAdapter: UnionEntityAdapter);
    get whereInputTypeName(): string;
    get subscriptionEventPayloadTypeName(): string;
    get rootTypeFieldNames(): RootTypeFieldNames;
}
export {};
