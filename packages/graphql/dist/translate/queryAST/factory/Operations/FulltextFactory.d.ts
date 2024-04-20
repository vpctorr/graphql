import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { FulltextOperation } from "../../ast/operations/FulltextOperation";
import { FulltextSelection } from "../../ast/selection/FulltextSelection";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class FulltextFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createFulltextOperation(entity: ConcreteEntityAdapter, resolveTree: ResolveTree, context: Neo4jGraphQLTranslationContext): FulltextOperation;
    getFulltextSelection(entity: ConcreteEntityAdapter, context: Neo4jGraphQLTranslationContext): FulltextSelection;
    private getFulltextOptions;
    private createFulltextScoreField;
}
