import type { GraphQLField, GraphQLResolveInfo } from "graphql";
import type { ResolveTree } from "graphql-parse-resolve-info";
export interface GetNeo4jResolveTreeOptions {
    resolveTree?: ResolveTree;
    field?: GraphQLField<any, any>;
    args?: any;
}
export default function getNeo4jResolveTree(resolveInfo: GraphQLResolveInfo, options?: GetNeo4jResolveTreeOptions): ResolveTree;