import { type DirectiveNode } from "graphql";
import type { Directive, SchemaComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare function augmentObjectOrInterfaceTypeWithRelationshipField(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter, userDefinedFieldDirectives: Map<string, DirectiveNode[]>, subgraph?: Subgraph | undefined): Record<string, {
    type: string;
    description?: string;
    directives: Directive[];
    args?: any;
}>;
export declare function augmentObjectOrInterfaceTypeWithConnectionField(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter, userDefinedFieldDirectives: Map<string, DirectiveNode[]>, schemaComposer: SchemaComposer): Record<string, {
    type: string;
    description?: string;
    directives: Directive[];
    args?: any;
}>;
