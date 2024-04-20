import type { Directive, InputTypeComposerFieldConfigMapDefinition } from "graphql-compose";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare function augmentWhereInputTypeWithRelationshipFields(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter, deprecatedDirectives: Directive[]): InputTypeComposerFieldConfigMapDefinition;
export declare function augmentWhereInputTypeWithConnectionFields(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter, deprecatedDirectives: Directive[]): InputTypeComposerFieldConfigMapDefinition;
