import { type DirectiveNode } from "graphql";
import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withOptionsInputType({ entityAdapter, userDefinedFieldDirectives, composer, }: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function withSortInputType({ relationshipAdapter, userDefinedFieldDirectives, composer, }: {
    relationshipAdapter: RelationshipAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
