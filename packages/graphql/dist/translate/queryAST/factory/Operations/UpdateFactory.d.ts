import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { UpdateOperation } from "../../ast/operations/UpdateOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class UpdateFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createUpdateOperation(entity: ConcreteEntityAdapter, resolveTree: ResolveTree, context: Neo4jGraphQLTranslationContext): UpdateOperation;
}
