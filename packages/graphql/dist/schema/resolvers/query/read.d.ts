import type { GraphQLResolveInfo } from "graphql";
import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function findResolver({ entityAdapter }: {
    entityAdapter: EntityAdapter;
}): {
    type: string;
    resolve: (_root: any, args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<any[]>;
    args: {
        where: string;
        options: string | import("graphql").GraphQLInputObjectType;
    };
};
