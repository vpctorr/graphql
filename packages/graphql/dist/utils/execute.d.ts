import type { SessionMode, QueryResult } from "neo4j-driver";
import type { GraphQLResolveInfo } from "graphql";
import type { Neo4jGraphQLComposedContext } from "../schema/resolvers/composition/wrap-query-and-mutation";
export interface ExecuteResult {
    bookmark: string | null;
    result: QueryResult;
    statistics: Record<string, number>;
    records: Record<PropertyKey, any>[];
}
declare function execute({ cypher, params, defaultAccessMode, context, info, }: {
    cypher: string;
    params: any;
    defaultAccessMode: SessionMode;
    context: Neo4jGraphQLComposedContext;
    info?: GraphQLResolveInfo;
}): Promise<ExecuteResult>;
export default execute;
