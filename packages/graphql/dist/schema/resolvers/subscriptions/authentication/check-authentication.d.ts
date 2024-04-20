import type { AuthenticationOperation } from "../../../../schema-model/annotation/AuthenticationAnnotation";
import type { Attribute } from "../../../../schema-model/attribute/Attribute";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntity } from "../../../../schema-model/entity/ConcreteEntity";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedSubscriptionsContext } from "../../composition/wrap-subscription";
export declare function checkAuthentication({ authenticated, operation, context, }: {
    authenticated: ConcreteEntity | Attribute | ConcreteEntityAdapter | AttributeAdapter;
    operation: AuthenticationOperation;
    context: Neo4jGraphQLComposedSubscriptionsContext;
}): void;
