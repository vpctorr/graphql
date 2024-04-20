import type { Node } from "../classes";
import type { RelationField } from "../types";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
declare function createDisconnectAndParams({ withVars, value, varName, relationField, parentVar, refNodes, context, labelOverride, parentNode, parameterPrefix, isFirstLevel, }: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Neo4jGraphQLTranslationContext;
    refNodes: Node[];
    labelOverride?: string;
    parentNode: Node;
    parameterPrefix: string;
    isFirstLevel?: boolean;
}): [string, any];
export default createDisconnectAndParams;
