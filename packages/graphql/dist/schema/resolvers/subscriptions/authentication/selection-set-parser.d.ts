import type { ConcreteEntity } from "../../../../schema-model/entity/ConcreteEntity";
import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../composition/wrap-subscription";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export type SelectionFields = {
    [k: string]: ResolveTree;
};
export declare function parseSelectionSetForAuthenticated({ resolveTree, entity, entityTypeName, entityPayloadTypeName, context, }: {
    resolveTree: ResolveTree;
    entity: ConcreteEntity | ConcreteEntityAdapter;
    entityTypeName: string;
    entityPayloadTypeName: string;
    context: Neo4jGraphQLComposedSubscriptionsContext;
}): {
    entity: ConcreteEntity | ConcreteEntityAdapter;
    fieldSelection: SelectionFields;
}[];
