import type { GraphQLResolveInfo } from "graphql";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function aggregateResolver({ entityAdapter, }: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<any>;
    args: {
        fulltext?: {
            type: string;
            description: string;
        } | undefined;
        where: string;
    };
};
