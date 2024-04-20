import type { ResolveTree } from "graphql-parse-resolve-info";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { AggregationOperation } from "../../ast/operations/AggregationOperation";
import { CompositeAggregationOperation } from "../../ast/operations/composite/CompositeAggregationOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class AggregateFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createAggregationOperation(entityOrRel: ConcreteEntityAdapter | RelationshipAdapter | InterfaceEntityAdapter, resolveTree: ResolveTree, context: Neo4jGraphQLTranslationContext): AggregationOperation | CompositeAggregationOperation;
    private getAggregationParsedProjectionFields;
    private hydrateAggregationOperation;
}
