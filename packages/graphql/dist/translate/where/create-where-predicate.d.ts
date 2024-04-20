import Cypher from "@neo4j/cypher-builder";
import type { EntityAdapter } from "../../schema-model/entity/EntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { GraphQLWhereArg } from "../../types";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function createWhereNodePredicate({ targetElement, whereInput, context, entity, targetEntity, }: {
    targetElement: Cypher.Node;
    whereInput: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
    entity: EntityAdapter;
    targetEntity?: ConcreteEntityAdapter;
}): {
    predicate: Cypher.Predicate | undefined;
    preComputedSubqueries?: Cypher.CompositeClause | undefined;
};
export declare function createWhereEdgePredicate({ targetElement, relationshipVariable, whereInput, context, relationship, }: {
    targetElement: Cypher.Node;
    relationshipVariable: Cypher.Relationship;
    whereInput: GraphQLWhereArg;
    context: Neo4jGraphQLTranslationContext;
    relationship: RelationshipAdapter;
}): {
    predicate: Cypher.Predicate | undefined;
    preComputedSubqueries?: Cypher.CompositeClause | undefined;
};
