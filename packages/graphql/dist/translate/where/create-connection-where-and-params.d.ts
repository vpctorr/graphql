import type { Node, Relationship } from "../../classes";
import type { ConnectionWhereArg } from "../../types";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export default function createConnectionWhereAndParams({ whereInput, context, node, nodeVariable, relationship, relationshipVariable, parameterPrefix, }: {
    whereInput: ConnectionWhereArg;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    nodeVariable: string;
    relationship: Relationship;
    relationshipVariable: string;
    parameterPrefix: string;
}): {
    cypher: string;
    subquery: string;
    params: Record<string, any>;
};
