import type { IExecutableSchemaDefinition } from "@graphql-tools/schema";
import type { DocumentNode, GraphQLSchema } from "graphql";
import type { Driver } from "neo4j-driver";
import type { Neo4jFeaturesSettings } from "../types";
import type { Neo4jGraphQLSessionConfig } from "./Executor";
import type { AssertIndexesAndConstraintsOptions } from "./utils/asserts-indexes-and-constraints";
type TypeDefinitions = string | DocumentNode | TypeDefinitions[] | (() => TypeDefinitions);
export interface Neo4jGraphQLConstructor {
    typeDefs: TypeDefinitions;
    resolvers?: IExecutableSchemaDefinition["resolvers"];
    features?: Neo4jFeaturesSettings;
    driver?: Driver;
    debug?: boolean;
    validate?: boolean;
}
declare class Neo4jGraphQL {
    private typeDefs;
    private resolvers?;
    private driver?;
    private features;
    private _nodes?;
    private _relationships?;
    private jwtFieldsMap?;
    private schemaModel?;
    private executableSchema?;
    private subgraphSchema?;
    private subscriptionInit?;
    private dbInfo?;
    private authorization?;
    private debug?;
    private validate;
    constructor(input: Neo4jGraphQLConstructor);
    getSchema(): Promise<GraphQLSchema>;
    getExecutableSchema(): Promise<GraphQLSchema>;
    getSubgraphSchema(): Promise<GraphQLSchema>;
    checkNeo4jCompat({ driver, sessionConfig, }?: {
        driver?: Driver;
        sessionConfig?: Neo4jGraphQLSessionConfig;
    }): Promise<void>;
    assertIndexesAndConstraints({ driver, sessionConfig, options, }?: {
        driver?: Driver;
        sessionConfig?: Neo4jGraphQLSessionConfig;
        options?: AssertIndexesAndConstraintsOptions;
    }): Promise<void>;
    private get nodes();
    private get relationships();
    /**
     * Currently just merges all type definitions into a document. Eventual intention described below:
     *
     * Normalizes the user's type definitions using the method with the lowest risk of side effects:
     * - Type definitions of type `string` are parsed using the `parse` function from the reference GraphQL implementation.
     * - Type definitions of type `DocumentNode` are returned as they are.
     * - Type definitions in arrays are merged using `mergeTypeDefs` from `@graphql-tools/merge`.
     * - Callbacks are resolved to a type which can be parsed into a document.
     *
     * This method maps to the Type Definition Normalization stage of the Schema Generation lifecycle.
     *
     * @param {TypeDefinitions} typeDefinitions - The unnormalized type definitions.
     * @returns {DocumentNode} The normalized type definitons as a document.
     */
    private normalizeTypeDefinitions;
    private addDefaultFieldResolvers;
    private checkEnableDebug;
    private getNeo4jDatabaseInfo;
    private wrapResolvers;
    private composeSchema;
    private parseNeo4jFeatures;
    private generateSchemaModel;
    private generateExecutableSchema;
    private generateSubgraphSchema;
    private subscriptionMechanismSetup;
}
export default Neo4jGraphQL;
