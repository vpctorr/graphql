import type { Session } from "neo4j-driver";
import type { Neo4jStruct } from "./types";
export default function toNeo4jStruct(sessionFactory: () => Session): Promise<Neo4jStruct>;
