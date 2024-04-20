import type { Node } from "../../classes";
import type { ConcreteEntity } from "../../schema-model/entity/ConcreteEntity";
import type { AuthenticationOperation } from "../../schema-model/annotation/AuthenticationAnnotation";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
import type { Operation } from "../../schema-model/Operation";
export declare function checkAuthentication({ context, node, targetOperations, field, }: {
    context: Neo4jGraphQLTranslationContext;
    node: Node;
    targetOperations: AuthenticationOperation[];
    field?: string;
}): void;
export declare function checkEntityAuthentication({ context, entity, targetOperations, field, }: {
    context: Neo4jGraphQLTranslationContext;
    entity: ConcreteEntity;
    targetOperations: AuthenticationOperation[];
    field?: string;
}): void;
export declare const isAuthenticated: (targetOperations: AuthenticationOperation[], entity: Operation | undefined) => (next: any) => (root: any, args: any, context: any, info: any) => any;
