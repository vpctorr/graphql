import type { DirectiveNode } from "graphql";
import type { SchemaComposer } from "graphql-compose";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
import type { Neo4jFeaturesSettings } from "../../types";
export declare function generateSubscriptionTypes({ schemaComposer, schemaModel, userDefinedFieldDirectivesForNode, generateRelationshipTypes, features, }: {
    schemaComposer: SchemaComposer;
    schemaModel: Neo4jGraphQLSchemaModel;
    userDefinedFieldDirectivesForNode: Map<string, Map<string, DirectiveNode[]>>;
    generateRelationshipTypes: boolean;
    features: Neo4jFeaturesSettings | undefined;
}): void;
