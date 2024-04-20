import type { FieldsByTypeName, ResolveTree } from "graphql-parse-resolve-info";
import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConnectionQueryArgs, GraphQLOptionsArg } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { Filter } from "../ast/filters/Filter";
import type { AggregationOperation } from "../ast/operations/AggregationOperation";
import type { ConnectionReadOperation } from "../ast/operations/ConnectionReadOperation";
import type { CypherOperation } from "../ast/operations/CypherOperation";
import type { CypherScalarOperation } from "../ast/operations/CypherScalarOperation";
import type { ReadOperation } from "../ast/operations/ReadOperation";
import type { CompositeAggregationOperation } from "../ast/operations/composite/CompositeAggregationOperation";
import type { CompositeConnectionReadOperation } from "../ast/operations/composite/CompositeConnectionReadOperation";
import type { CompositeCypherOperation } from "../ast/operations/composite/CompositeCypherOperation";
import type { CompositeReadOperation } from "../ast/operations/composite/CompositeReadOperation";
import type { Operation } from "../ast/operations/operations";
import type { FulltextSelection } from "../ast/selection/FulltextSelection";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class OperationsFactory {
    private filterFactory;
    private fieldFactory;
    private sortAndPaginationFactory;
    private authorizationFactory;
    private createFactory;
    private updateFactory;
    private deleteFactory;
    private fulltextFactory;
    private aggregateFactory;
    private customCypherFactory;
    private connectionFactory;
    private readFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createTopLevelOperation({ entity, resolveTree, context, varName, reference, }: {
        entity?: EntityAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        varName?: string;
        reference?: any;
    }): Operation;
    /**
     *  Proxy methods to specialized operations factories.
     *  TODO: Refactor the following to use a generic dispatcher as done in createTopLevelOperation
     **/
    createReadOperation(arg: {
        entityOrRel: EntityAdapter | RelationshipAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        varName?: string;
        reference?: any;
    }): ReadOperation | CompositeReadOperation;
    getFulltextSelection(entity: ConcreteEntityAdapter, context: Neo4jGraphQLTranslationContext): FulltextSelection;
    createAggregationOperation(entityOrRel: ConcreteEntityAdapter | RelationshipAdapter | InterfaceEntityAdapter, resolveTree: ResolveTree, context: Neo4jGraphQLTranslationContext): AggregationOperation | CompositeAggregationOperation;
    getConnectionOptions(entity: ConcreteEntityAdapter | InterfaceEntityAdapter, options: Record<string, any>): Pick<ConnectionQueryArgs, "first" | "after" | "sort"> | undefined;
    splitConnectionFields(rawFields: Record<string, ResolveTree>): {
        node: ResolveTree | undefined;
        edge: ResolveTree | undefined;
        fields: Record<string, ResolveTree>;
    };
    createConnectionOperationAST(arg: {
        relationship?: RelationshipAdapter;
        target: ConcreteEntityAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
    }): ConnectionReadOperation | CompositeConnectionReadOperation;
    createCompositeConnectionOperationAST(arg: {
        relationship?: RelationshipAdapter;
        target: InterfaceEntityAdapter | UnionEntityAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
    }): CompositeConnectionReadOperation;
    hydrateReadOperation<T extends ReadOperation>(arg: {
        entity: ConcreteEntityAdapter;
        operation: T;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        whereArgs: Record<string, any> | Filter[];
        partialOf?: InterfaceEntityAdapter | UnionEntityAdapter;
    }): T;
    createCustomCypherOperation(arg: {
        resolveTree?: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        entity?: EntityAdapter;
        cypherAttributeField: AttributeAdapter;
        cypherArguments?: Record<string, any>;
    }): CypherOperation | CompositeCypherOperation | CypherScalarOperation;
    /**
     * END of proxy methods
     **/
    hydrateOperation<T extends ReadOperation>({ entity, operation, whereArgs, context, sortArgs, fieldsByTypeName, partialOf, }: {
        entity: ConcreteEntityAdapter;
        operation: T;
        context: Neo4jGraphQLTranslationContext;
        whereArgs: Record<string, any>;
        sortArgs?: Record<string, any>;
        fieldsByTypeName: FieldsByTypeName;
        partialOf?: UnionEntityAdapter | InterfaceEntityAdapter;
    }): T;
    getOptions(entity: EntityAdapter, options?: Record<string, any>): GraphQLOptionsArg | undefined;
    getSelectedAttributes(entity: ConcreteEntityAdapter, rawFields: Record<string, ResolveTree>): AttributeAdapter[];
    getWhereArgs(resolveTree: ResolveTree, reference?: any): Record<string, any>;
}
