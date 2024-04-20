import { type DocumentNode } from "graphql";
import type { Neo4jGraphQLConstructor } from "@neo4j/graphql";
export declare function filterDocument(typeDefs: Neo4jGraphQLConstructor["typeDefs"]): DocumentNode;
