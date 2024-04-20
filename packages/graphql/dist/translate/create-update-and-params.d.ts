import type { Node } from "../classes";
import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
export default function createUpdateAndParams({ updateInput, varName, node, parentVar, chainStr, withVars, context, callbackBucket, parameterPrefix, includeRelationshipValidation, }: {
    parentVar: string;
    updateInput: any;
    varName: string;
    chainStr?: string;
    node: Node;
    withVars: string[];
    context: Neo4jGraphQLTranslationContext;
    callbackBucket: CallbackBucket;
    parameterPrefix: string;
    includeRelationshipValidation?: boolean;
}): [string, any];
