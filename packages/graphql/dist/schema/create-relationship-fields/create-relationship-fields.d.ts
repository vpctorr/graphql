import { type DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, SchemaComposer } from "graphql-compose";
import { ObjectTypeComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { Neo4jFeaturesSettings } from "../../types";
export declare function createRelationshipFields({ entityAdapter, schemaComposer, composeNode, subgraph, userDefinedFieldDirectives, seenRelationshipPropertiesTypes, userDefinedDirectivesForNode, userDefinedFieldDirectivesForNode, features, }: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    schemaComposer: SchemaComposer;
    composeNode: ObjectTypeComposer | InterfaceTypeComposer;
    subgraph?: Subgraph;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    seenRelationshipPropertiesTypes: Set<string>;
    userDefinedDirectivesForNode: Map<string, DirectiveNode[]>;
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
    features?: Neo4jFeaturesSettings;
}): void;
