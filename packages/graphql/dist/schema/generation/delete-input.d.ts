import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare function withDeleteInputType({ entityAdapter, composer, }: {
    entityAdapter: InterfaceEntityAdapter | ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function augmentDeleteInputTypeWithDeleteFieldInput({ relationshipAdapter, composer, deprecatedDirectives, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
}): void;
export declare function withUnionDeleteInputType({ relationshipAdapter, composer, deprecatedDirectives, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
}): InputTypeComposer | undefined;
export declare function withDeleteFieldInputType({ relationshipAdapter, composer, ifUnionMemberEntity, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
    ifUnionMemberEntity?: ConcreteEntityAdapter;
}): InputTypeComposer | undefined;
