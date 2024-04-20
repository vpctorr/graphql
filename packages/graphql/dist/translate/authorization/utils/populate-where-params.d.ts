import type { GraphQLWhereArg } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
export declare function populateWhereParams({ where, context, }: {
    where: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
}): GraphQLWhereArg;
