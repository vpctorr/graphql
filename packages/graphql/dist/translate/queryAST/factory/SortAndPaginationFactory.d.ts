import type Cypher from "@neo4j/cypher-builder";
import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConnectionSortArg, GraphQLOptionsArg } from "../../../types";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import { Pagination } from "../ast/pagination/Pagination";
import type { Sort } from "../ast/sort/Sort";
import type { QueryASTFactory } from "./QueryASTFactory";
export declare class SortAndPaginationFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createSortFields(options: GraphQLOptionsArg, entity: EntityAdapter | RelationshipAdapter, context: Neo4jGraphQLTranslationContext, scoreVariable?: Cypher.Variable): Sort[];
    createConnectionSortFields(options: ConnectionSortArg, entityOrRel: EntityAdapter | RelationshipAdapter, context: Neo4jGraphQLTranslationContext): {
        edge: Sort[];
        node: Sort[];
    };
    createPagination(options: GraphQLOptionsArg): Pagination | undefined;
    private createPropertySort;
}
