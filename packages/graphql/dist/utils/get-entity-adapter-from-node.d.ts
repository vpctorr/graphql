import type { EntityAdapter } from "../schema-model/entity/EntityAdapter";
import type { Node } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export declare function getEntityAdapterFromNode(node: Node, context: Neo4jGraphQLTranslationContext): EntityAdapter;
