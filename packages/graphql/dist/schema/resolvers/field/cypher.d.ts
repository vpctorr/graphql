import type { GraphQLResolveInfo } from "graphql";
import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { CypherField } from "../../../types";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function cypherResolver({ field, attributeAdapter, type, }: {
    field: CypherField;
    attributeAdapter: AttributeAdapter;
    type: "Query" | "Mutation";
}): {
    type: string;
    resolve: (_root: any, args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<any>;
    args: {};
};
