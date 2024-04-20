import { type GraphQLResolveInfo } from "graphql";
import type { Node } from "../../../classes";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function createResolver({ node, concreteEntityAdapter, }: {
    node: Node;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): {
    type: string;
    resolve: (_root: any, args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<{
        info: {
            bookmark: string | null;
        };
    }>;
    args: import("../../../schema-model/entity/model-adapters/ImplementingEntityOperations").CreateMutationArgumentNames;
};
