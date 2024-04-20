import type { Driver } from "neo4j-driver";
import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
import type { Neo4jGraphQLSessionConfig } from "../Executor";
export interface AssertIndexesAndConstraintsOptions {
    create?: boolean;
}
export declare function assertIndexesAndConstraints({ driver, sessionConfig, schemaModel, options, }: {
    driver: Driver;
    sessionConfig?: Neo4jGraphQLSessionConfig;
    schemaModel: Neo4jGraphQLSchemaModel;
    options?: AssertIndexesAndConstraintsOptions;
}): Promise<void>;
