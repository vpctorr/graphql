import type { Driver } from "neo4j-driver";
import type { Neo4jDatabaseInfo } from "../Neo4jDatabaseInfo";
import type { Neo4jGraphQLSessionConfig } from "../Executor";
declare function checkNeo4jCompat({ driver, sessionConfig, dbInfo, }: {
    driver: Driver;
    sessionConfig?: Neo4jGraphQLSessionConfig;
    dbInfo: Neo4jDatabaseInfo;
}): Promise<void>;
export default checkNeo4jCompat;
