import type { ResolveTree } from "graphql-parse-resolve-info";
import type { EntityAdapter } from "../../../../schema-model/entity/EntityAdapter";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import type { Filter } from "../../ast/filters/Filter";
import { ReadOperation } from "../../ast/operations/ReadOperation";
import { CompositeReadOperation } from "../../ast/operations/composite/CompositeReadOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class ReadFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createReadOperation({ entityOrRel, resolveTree, context, varName, reference, }: {
        entityOrRel: EntityAdapter | RelationshipAdapter;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        varName?: string;
        reference?: any;
    }): ReadOperation | CompositeReadOperation;
    hydrateReadOperation<T extends ReadOperation>({ entity, operation, resolveTree, context, whereArgs, partialOf, }: {
        entity: ConcreteEntityAdapter;
        operation: T;
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        whereArgs: Record<string, any> | Filter[];
        partialOf?: InterfaceEntityAdapter | UnionEntityAdapter;
    }): T;
    private hydrateCompositeReadOperationWithPagination;
}
