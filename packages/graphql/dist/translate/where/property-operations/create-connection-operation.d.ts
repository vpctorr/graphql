import Cypher from "@neo4j/cypher-builder";
import type { Node, Relationship } from "../../../classes";
import type { ConnectionWhereArg, PredicateReturn } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function createConnectionWherePropertyOperation({ context, whereInput, edgeRef, targetNode, node, edge, useExistExpr, checkParameterExistence, }: {
    whereInput: ConnectionWhereArg;
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    edge: Relationship;
    edgeRef: Cypher.Variable;
    targetNode: Cypher.Node;
    useExistExpr?: boolean;
    checkParameterExistence?: boolean;
}): PredicateReturn;
