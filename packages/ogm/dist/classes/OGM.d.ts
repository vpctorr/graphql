import type { Neo4jGraphQLConstructor } from "@neo4j/graphql";
import type { GraphQLSchema } from "graphql";
import type { Driver, SessionConfig } from "neo4j-driver";
import Model from "./Model";
export interface OGMConstructor extends Neo4jGraphQLConstructor {
    database?: string;
}
type AssertIndexesAndConstraintsOptions = {
    create?: boolean;
};
type Neo4jGraphQLSessionConfig = Pick<SessionConfig, "database" | "impersonatedUser" | "auth">;
declare class OGM<ModelMap = unknown> {
    checkNeo4jCompat: (input?: {
        driver?: Driver;
        sessionConfig?: Neo4jGraphQLSessionConfig;
    }) => Promise<void>;
    assertIndexesAndConstraints: (input?: {
        driver?: Driver;
        sessionConfig?: Neo4jGraphQLSessionConfig;
        options?: AssertIndexesAndConstraintsOptions;
    }) => Promise<void>;
    private models;
    private neoSchema;
    private _schema?;
    private initializer?;
    private database?;
    constructor(input: OGMConstructor);
    get schema(): GraphQLSchema;
    init(): Promise<void>;
    model<M extends T extends keyof ModelMap ? ModelMap[T] : Model, T extends keyof ModelMap | string = string>(name: T): M;
    private get nodes();
    private initModel;
    private createInitializer;
}
export default OGM;
