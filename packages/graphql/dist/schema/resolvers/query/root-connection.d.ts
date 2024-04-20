import { type DirectiveNode, type GraphQLResolveInfo } from "graphql";
import type { InputTypeComposer, SchemaComposer } from "graphql-compose";
import type { PageInfo as PageInfoRelay } from "graphql-relay";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function rootConnectionResolver({ composer, entityAdapter, propagatedDirectives, }: {
    composer: SchemaComposer;
    entityAdapter: InterfaceEntityAdapter | ConcreteEntityAdapter;
    propagatedDirectives: DirectiveNode[];
}): {
    type: import("graphql-compose").NonNullComposer<import("graphql-compose").ObjectTypeComposer<any, any>>;
    resolve: (_root: any, args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<{
        totalCount: number;
        edges: any[];
        pageInfo: PageInfoRelay;
    }>;
    args: {
        fulltext?: {
            type: string;
            description: string;
        } | undefined;
        sort?: import("graphql-compose").ListComposer<InputTypeComposer<any>> | undefined;
        first: import("graphql").GraphQLScalarType<number, number>;
        after: import("graphql").GraphQLScalarType<string, string>;
        where: string;
    };
};
