import { ImplementingEntityOperations } from "./ImplementingEntityOperations";
import type { InterfaceEntityAdapter } from "./InterfaceEntityAdapter";
export declare class InterfaceEntityOperations extends ImplementingEntityOperations<InterfaceEntityAdapter> {
    constructor(interfaceEntityAdapter: InterfaceEntityAdapter);
    get implementationEnumTypename(): string;
    get implementationsSubscriptionWhereInputTypeName(): string;
    get fullTextInputTypeName(): string;
    getFullTextIndexInputTypeName(indexName: string): string;
    get connectionFieldTypename(): string;
}
