import type { ResolveTree } from "graphql-parse-resolve-info";
import type { EntityAdapter } from "../../../../schema-model/entity/EntityAdapter";
import { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConnectionQueryArgs } from "../../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { ConnectionReadOperation } from "../../ast/operations/ConnectionReadOperation";
import { CompositeConnectionReadOperation } from "../../ast/operations/composite/CompositeConnectionReadOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class ConnectionFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createCompositeConnectionOperationAST({ relationship, target, resolveTree, context, }: {
        relationship?: RelationshipAdapter;
        target: InterfaceEntityAdapter | UnionEntityAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
    }): CompositeConnectionReadOperation;
    createConnectionOperationAST({ relationship, target, resolveTree, context, }: {
        relationship?: RelationshipAdapter;
        target: EntityAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
    }): ConnectionReadOperation | CompositeConnectionReadOperation;
    private hydrateConnectionOperationsASTWithSort;
    normalizeResolveTreeForTopLevelConnection(resolveTree: ResolveTree): ResolveTree;
    splitConnectionFields(rawFields: Record<string, ResolveTree>): {
        node: ResolveTree | undefined;
        edge: ResolveTree | undefined;
        fields: Record<string, ResolveTree>;
    };
    getConnectionOptions(entity: ConcreteEntityAdapter | InterfaceEntityAdapter, options: Record<string, any>): Pick<ConnectionQueryArgs, "first" | "after" | "sort"> | undefined;
    private hydrateConnectionOperationAST;
    private parseConnectionFields;
}
