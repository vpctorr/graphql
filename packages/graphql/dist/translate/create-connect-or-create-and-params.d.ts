import Cypher from "@neo4j/cypher-builder";
import type { Node } from "../classes";
import type { CallbackBucket } from "../classes/CallbackBucket";
import type { RelationField } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
type CreateOrConnectInput = {
    where?: {
        node: Record<string, any>;
    };
    onCreate?: {
        node?: Record<string, any>;
        edge?: Record<string, any>;
    };
};
export declare function createConnectOrCreateAndParams({ input, varName, parentVar, relationField, refNode, node, context, withVars, callbackBucket, }: {
    input: CreateOrConnectInput[] | CreateOrConnectInput;
    varName: string;
    parentVar: string;
    relationField: RelationField;
    refNode: Node;
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    withVars: string[];
    callbackBucket: CallbackBucket;
}): Cypher.CypherResult;
export {};
