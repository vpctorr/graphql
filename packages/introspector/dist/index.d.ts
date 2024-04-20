import type { Session } from "neo4j-driver";
import type { Neo4jStruct } from "./types";
export declare function toGenericStruct(sessionFactory: () => Session): Promise<Neo4jStruct>;
export declare function toGraphQLTypeDefs(sessionFactory: () => Session, readonly?: boolean): Promise<string>;
