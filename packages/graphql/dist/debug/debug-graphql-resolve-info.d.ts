import type { Debugger } from "debug";
import { type GraphQLResolveInfo } from "graphql";
/**
 * Logs the GraphQL query and variable values from a GraphQLResolveInfo instance.
 *
 * @param debug A Debugger instance.
 * @param info The GraphQLResolveInfo instance to be logged.
 */
export declare function debugGraphQLResolveInfo(debug: Debugger, info: GraphQLResolveInfo): void;
