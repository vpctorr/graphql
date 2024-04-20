import type { ResolveTree } from "graphql-parse-resolve-info";
import { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { EntityAdapter } from "../../../../schema-model/entity/EntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../../types/neo4j-graphql-translation-context";
import { CypherOperation } from "../../ast/operations/CypherOperation";
import { CypherScalarOperation } from "../../ast/operations/CypherScalarOperation";
import { CompositeCypherOperation } from "../../ast/operations/composite/CompositeCypherOperation";
import type { QueryASTFactory } from "../QueryASTFactory";
export declare class CustomCypherFactory {
    private queryASTFactory;
    constructor(queryASTFactory: QueryASTFactory);
    createCustomCypherOperation({ resolveTree, context, entity, cypherAttributeField, cypherArguments, }: {
        resolveTree?: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        entity?: EntityAdapter;
        cypherAttributeField: AttributeAdapter;
        cypherArguments?: Record<string, any>;
    }): CypherOperation | CompositeCypherOperation | CypherScalarOperation;
    createTopLevelCustomCypherOperation({ resolveTree, context, entity, }: {
        resolveTree: ResolveTree;
        context: Neo4jGraphQLTranslationContext;
        entity?: EntityAdapter;
    }): CypherOperation | CompositeCypherOperation | CypherScalarOperation;
}
