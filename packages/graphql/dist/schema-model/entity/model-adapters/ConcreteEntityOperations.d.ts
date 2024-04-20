import type { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import type { RootTypeFieldNames as ImplementingTypeRootTypeFieldNames } from "./ImplementingEntityOperations";
import { ImplementingEntityOperations } from "./ImplementingEntityOperations";
type RootTypeFieldNames = ImplementingTypeRootTypeFieldNames & {
    connection: string;
    subscribe: {
        created: string;
        updated: string;
        deleted: string;
        relationship_created: string;
        relationship_deleted: string;
    };
};
type FulltextTypeNames = {
    result: string;
    where: string;
    sort: string;
};
export declare class ConcreteEntityOperations extends ImplementingEntityOperations<ConcreteEntityAdapter> {
    constructor(concreteEntityAdapter: ConcreteEntityAdapter);
    get fullTextInputTypeName(): string;
    getFullTextIndexInputTypeName(indexName: string): string;
    getFullTextIndexQueryFieldName(indexName: string): string;
    get relationshipsSubscriptionWhereInputTypeName(): string;
    get relationshipCreatedSubscriptionWhereInputTypeName(): string;
    get relationshipDeletedSubscriptionWhereInputTypeName(): string;
    get connectionFieldTypename(): string;
    get relationshipFieldTypename(): string;
    get rootTypeFieldNames(): RootTypeFieldNames;
    get fulltextTypeNames(): FulltextTypeNames;
}
export {};
