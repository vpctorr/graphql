import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Neo4jGraphQLSchemaModel } from "../../../schema-model/Neo4jGraphQLSchemaModel";
import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import { QueryAST } from "../ast/QueryAST";
import { AuthorizationFactory } from "./AuthorizationFactory";
import { FieldFactory } from "./FieldFactory";
import { FilterFactory } from "./FilterFactory";
import { OperationsFactory } from "./OperationFactory";
import { SortAndPaginationFactory } from "./SortAndPaginationFactory";
export declare class QueryASTFactory {
    schemaModel: Neo4jGraphQLSchemaModel;
    operationsFactory: OperationsFactory;
    filterFactory: FilterFactory;
    fieldFactory: FieldFactory;
    sortAndPaginationFactory: SortAndPaginationFactory;
    authorizationFactory: AuthorizationFactory;
    constructor(schemaModel: Neo4jGraphQLSchemaModel);
    createQueryAST({ resolveTree, entityAdapter, context, reference, varName, }: {
        resolveTree: ResolveTree;
        entityAdapter?: EntityAdapter;
        context: Neo4jGraphQLTranslationContext;
        reference?: any;
        varName?: string;
    }): QueryAST;
}
