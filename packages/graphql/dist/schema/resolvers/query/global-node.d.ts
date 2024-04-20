import type { GraphQLResolveInfo } from "graphql";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function globalNodeResolver({ entities }: {
    entities: ConcreteEntityAdapter[];
}): {
    type: string;
    resolve: (_root: any, args: {
        id: string;
    }, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<null>;
    args: {
        id: string;
    };
};
