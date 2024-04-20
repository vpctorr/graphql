import type { DirectiveNode } from "graphql";
import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function hasProperties(x: ObjectTypeComposer): boolean;
export declare function getConnectedTypes({ entityAdapter, schemaComposer, nodeNameToEventPayloadTypes, userDefinedFieldDirectivesForNode, }: {
    entityAdapter: ConcreteEntityAdapter;
    schemaComposer: SchemaComposer;
    nodeNameToEventPayloadTypes: Record<string, ObjectTypeComposer>;
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
}): {};
