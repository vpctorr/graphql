import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
export declare class FieldAggregationComposer {
    private aggregationTypesMapper;
    private composer;
    constructor(composer: SchemaComposer, subgraph?: Subgraph);
    private createAggregationField;
    createAggregationTypeObject(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter): ObjectTypeComposer;
    private getAggregationFields;
}
