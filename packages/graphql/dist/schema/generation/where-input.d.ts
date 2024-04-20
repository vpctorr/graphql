import type { DirectiveNode } from "graphql";
import type { Directive, InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { EntityAdapter } from "../../schema-model/entity/EntityAdapter";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import type { Neo4jFeaturesSettings } from "../../types";
export declare function withUniqueWhereInputType({ concreteEntityAdapter, composer, }: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer;
export declare function withWhereInputType({ entityAdapter, userDefinedFieldDirectives, features, composer, typeName, returnUndefinedIfEmpty, alwaysAllowNesting, }: {
    entityAdapter: EntityAdapter | RelationshipAdapter;
    typeName?: string;
    userDefinedFieldDirectives?: Map<string, DirectiveNode[]>;
    features: Neo4jFeaturesSettings | undefined;
    composer: SchemaComposer;
    interfaceOnTypeName?: string;
    returnUndefinedIfEmpty?: boolean;
    alwaysAllowNesting?: boolean;
}): InputTypeComposer | undefined;
export declare function withSourceWhereInputType({ relationshipAdapter, composer, deprecatedDirectives, userDefinedDirectivesOnTargetFields, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined;
}): InputTypeComposer | undefined;
export declare function withConnectWhereFieldInputType(relationshipTarget: ConcreteEntityAdapter | InterfaceEntityAdapter, composer: SchemaComposer): InputTypeComposer;
