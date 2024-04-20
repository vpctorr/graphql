import type { InputTypeComposer, ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare function makeConnectionWhereInputType({ relationshipAdapter, composer, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function withConnectionWhereInputType({ relationshipAdapter, memberEntity, composer, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    memberEntity?: ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function withConnectionSortInputType({ relationshipAdapter, composer, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function withConnectionObjectType({ relationshipAdapter, composer, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
}): ObjectTypeComposer;
