import type { SubscriptionsAuthorizationWhere } from "../../../../../schema-model/annotation/SubscriptionsAuthorizationAnnotation";
import type { GraphQLWhereArg } from "../../../../../types";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../../composition/wrap-subscription";
export declare function populateWhereParams({ where, context, }: {
    where: SubscriptionsAuthorizationWhere | GraphQLWhereArg;
    context: Neo4jGraphQLComposedSubscriptionsContext;
}): SubscriptionsAuthorizationWhere;
