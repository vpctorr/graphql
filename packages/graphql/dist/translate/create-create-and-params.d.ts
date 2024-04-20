import type { Node } from "../classes";
import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
type CreateAndParams = {
    create: string;
    params: Record<string, unknown>;
    authorizationPredicates: string[];
    authorizationSubqueries: string[];
};
declare function createCreateAndParams({ input, varName, node, context, callbackBucket, withVars, includeRelationshipValidation, topLevelNodeVariable, authorizationPrefix, }: {
    input: any;
    varName: string;
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    callbackBucket: CallbackBucket;
    withVars: string[];
    includeRelationshipValidation?: boolean;
    topLevelNodeVariable?: string;
    authorizationPrefix?: number[];
}): CreateAndParams;
export default createCreateAndParams;
