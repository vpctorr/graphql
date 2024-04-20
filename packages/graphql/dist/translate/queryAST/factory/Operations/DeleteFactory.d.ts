import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { DeleteOperation } from "../../ast/operations/DeleteOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class DeleteFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    private parseDeleteArgs;
    createTopLevelDeleteOperation({ entity, resolveTree, context, varName, }: {
        entity: ConcreteEntityAdapter;
        resolveTree: Record<string, any>;
        context: Neo4jGraphQLTranslationContext;
        varName?: string;
    }): DeleteOperation;
    private createNestedDeleteOperationsForInterface;
    private createNestedDeleteOperationsForUnion;
    private createNestedDeleteOperations;
    private createNestedDeleteOperation;
}
