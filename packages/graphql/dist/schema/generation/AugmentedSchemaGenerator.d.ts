import type { ObjectTypeDefinitionNode } from "graphql";
import { SchemaComposer } from "graphql-compose";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
import type { DefinitionNodes } from "../get-definition-nodes";
export declare class AugmentedSchemaGenerator {
    private schemaModel;
    private definitionNodes;
    private rootTypesCustomResolvers;
    private composer;
    constructor(schemaModel: Neo4jGraphQLSchemaModel, definitionNodes: DefinitionNodes, rootTypesCustomResolvers: ObjectTypeDefinitionNode[]);
    /**
     * This function will replace make-augmented-schema in orchestrating the creation of the types for each schemaModel construct
     *
     * @returns graphql-compose composer representing the augmented schema
     */
    generate(): SchemaComposer<any>;
    private pipeDefs;
    private getStaticTypes;
    private getSpatialTypes;
    private getTemporalTypes;
    private addToComposer;
}
