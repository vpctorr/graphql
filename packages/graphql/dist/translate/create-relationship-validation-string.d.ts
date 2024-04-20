import type { Node } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
declare function createRelationshipValidationString({ node, context, varName, relationshipFieldNotOverwritable, }: {
    node: Node;
    context: Neo4jGraphQLTranslationContext;
    varName: string;
    relationshipFieldNotOverwritable?: string;
}): string;
export default createRelationshipValidationString;
