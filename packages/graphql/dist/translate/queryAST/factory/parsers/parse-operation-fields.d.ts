import type { Neo4jGraphQLSchemaModel } from "../../../../schema-model/Neo4jGraphQLSchemaModel";
import type { EntityAdapter } from "../../../../schema-model/entity/EntityAdapter";
export type TopLevelOperationFieldMatch = "READ" | "CONNECTION" | "AGGREGATE" | "CREATE" | "UPDATE" | "DELETE" | "CUSTOM_CYPHER";
export declare function parseTopLevelOperationField(field: string, schemaModel: Neo4jGraphQLSchemaModel, entityAdapter?: EntityAdapter): TopLevelOperationFieldMatch;
