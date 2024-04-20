import type { DirectiveNode } from "graphql";
import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare function createOnCreateITC({ schemaComposer, relationshipAdapter, targetEntityAdapter, userDefinedFieldDirectives, }: {
    schemaComposer: SchemaComposer;
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    targetEntityAdapter: ConcreteEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}): InputTypeComposer;
