import type { GraphQLResolveInfo } from "graphql";
import type { Neo4jGraphQLContext } from "../../../types/neo4j-graphql-context";
/**
 * Based on the default field resolver used by graphql-js that accounts for aliased fields
 * @link https://github.com/graphql/graphql-js/blob/main/src/execution/execute.ts#L999-L1015
 */
export declare function defaultFieldResolver(source: any, args: any, context: Neo4jGraphQLContext, info: GraphQLResolveInfo): any;
