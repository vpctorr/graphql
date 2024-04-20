import type { Neo4jGraphQLSchemaModel } from "../../schema-model/Neo4jGraphQLSchemaModel";
import type { Neo4jGraphQLSubscriptionsEngine } from "../../types";
import type { ExecuteResult } from "../../utils/execute";
export declare function publishEventsToSubscriptionMechanism(executeResult: ExecuteResult, plugin: Neo4jGraphQLSubscriptionsEngine | undefined, schemaModel: Neo4jGraphQLSchemaModel): void;
export declare function serializeProperties(properties: Record<string, any> | undefined): Record<string, any> | undefined;
