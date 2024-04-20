import type { GraphQLResolveInfo } from "graphql";
import type { SchemaComposer } from "graphql-compose";
import type { Node } from "../../../classes";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function deleteResolver({ node, composer, concreteEntityAdapter, }: {
    node: Node;
    composer: SchemaComposer;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): {
    type: string;
    resolve: (_root: any, args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<{
        bookmark: string | null;
    }>;
    args: {
        delete?: string | undefined;
        where: string;
    };
};
