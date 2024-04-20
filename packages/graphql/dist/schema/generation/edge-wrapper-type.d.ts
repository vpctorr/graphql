import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function withEdgeWrapperType({ edgeTypeName, edgeFieldTypeName, edgeFieldAdapter, composer, }: {
    edgeTypeName: string;
    edgeFieldTypeName: string;
    edgeFieldAdapter: RelationshipAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
