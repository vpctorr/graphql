import type { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipDeclarationAdapter } from "./RelationshipDeclarationAdapter";
import type { RelationshipAdapter } from "./RelationshipAdapter";
export declare abstract class RelationshipBaseOperations<T extends RelationshipAdapter | RelationshipDeclarationAdapter> {
    protected readonly relationship: T;
    protected constructor(relationship: T);
    protected get prefixForTypename(): string;
    protected get prefixForTypenameWithInheritance(): string;
    protected abstract get fieldInputPrefixForTypename(): string;
    protected abstract get edgePrefix(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    getAggregationFieldTypename(nestedField?: "node" | "edge"): string;
    getTargetTypePrettyName(): string;
    getFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getConnectionUnionWhereInputTypename(concreteEntityAdapter: ConcreteEntityAdapter): string;
    /**Note: Required for now to infer the types without ResolveTree */
    get connectionFieldTypename(): string;
    get connectionSortInputTypename(): string;
    get connectionWhereInputTypename(): string;
    /**Note: Required for now to infer the types without ResolveTree */
    get relationshipFieldTypename(): string;
    getUpdateFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getCreateFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getDeleteFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getConnectFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getDisconnectFieldInputTypeName(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getConnectOrCreateInputTypeName(): string;
    getConnectOrCreateFieldInputTypeName(concreteTargetEntityAdapter?: ConcreteEntityAdapter): string;
    getConnectOrCreateOnCreateFieldInputTypeName(concreteTargetEntityAdapter: ConcreteEntityAdapter): string;
    get connectionFieldName(): string;
    getConnectionWhereTypename(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    getUpdateConnectionInputTypename(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): string;
    get aggregateInputTypeName(): string;
    get aggregateTypeName(): string;
    get nodeAggregationWhereInputTypeName(): string;
    get unionConnectInputTypeName(): string;
    get unionDeleteInputTypeName(): string;
    get unionDisconnectInputTypeName(): string;
    get unionCreateInputTypeName(): string;
    get unionCreateFieldInputTypeName(): string;
    get unionUpdateInputTypeName(): string;
    getToUnionUpdateInputTypeName(ifUnionRelationshipTargetEntity: ConcreteEntityAdapter): string;
    get edgeCreateInputTypeName(): string;
    get createInputTypeName(): string;
    get edgeUpdateInputTypeName(): string;
    get whereInputTypeName(): string;
    get sortInputTypeName(): string;
    get edgeAggregationWhereInputTypeName(): string;
    getConnectOrCreateInputFields(target: ConcreteEntityAdapter): {
        where: string;
        onCreate: string;
    };
}
