import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jFeaturesSettings } from "../../types";
export declare function generateSubscriptionConnectionWhereType({ entityAdapter, schemaComposer, features, }: {
    entityAdapter: ConcreteEntityAdapter;
    schemaComposer: SchemaComposer;
    features: Neo4jFeaturesSettings | undefined;
}): {
    created: InputTypeComposer;
    deleted: InputTypeComposer;
} | undefined;
