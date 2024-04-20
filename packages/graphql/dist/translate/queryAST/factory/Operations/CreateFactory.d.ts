import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { CreateOperation } from "../../ast/operations/CreateOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class CreateFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createCreateOperation(entity: ConcreteEntityAdapter, resolveTree: ResolveTree, context: Neo4jGraphQLTranslationContext): CreateOperation;
}
