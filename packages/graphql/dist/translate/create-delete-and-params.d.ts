import type { Node } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
declare function createDeleteAndParams({ deleteInput, varName, node, parentVar, chainStr, withVars, context, parameterPrefix, recursing, }: {
    parentVar: string;
    deleteInput: any;
    varName: string;
    chainStr?: string;
    node: Node;
    withVars: string[];
    context: Neo4jGraphQLTranslationContext;
    parameterPrefix: string;
    recursing?: boolean;
}): [string, any];
export default createDeleteAndParams;
