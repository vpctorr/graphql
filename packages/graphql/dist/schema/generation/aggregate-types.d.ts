import type { DirectiveNode } from "graphql";
import type { InputTypeComposer, ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import type { AggregationTypesMapper } from "../aggregations/aggregation-types-mapper";
export declare function withAggregateSelectionType({ entityAdapter, aggregationTypesMapper, propagatedDirectives, composer, }: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    aggregationTypesMapper: AggregationTypesMapper;
    propagatedDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): ObjectTypeComposer;
export declare function withAggregateInputType({ relationshipAdapter, entityAdapter, // TODO: this is relationshipAdapter.target but from the context above it is known to be ConcreteEntity and we don't know this yet!!!
composer, userDefinedDirectivesOnTargetFields, }: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    composer: SchemaComposer;
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined;
}): InputTypeComposer;
