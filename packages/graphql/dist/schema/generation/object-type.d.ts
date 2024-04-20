import type { DirectiveNode } from "graphql";
import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function getRelationshipPropertiesTypeDescription({ relationshipAdapter, propertiesObjectType, }: {
    relationshipAdapter: RelationshipAdapter;
    propertiesObjectType?: ObjectTypeComposer;
}): string;
export declare function withObjectType({ entityAdapter, userDefinedFieldDirectives, userDefinedObjectDirectives, composer, }: {
    entityAdapter: ConcreteEntityAdapter | RelationshipAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    userDefinedObjectDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): ObjectTypeComposer;
