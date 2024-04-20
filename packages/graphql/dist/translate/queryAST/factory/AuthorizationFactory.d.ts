import type Cypher from "@neo4j/cypher-builder";
import type { AuthorizationAnnotation, AuthorizationOperation, ValidateWhen } from "../../../schema-model/annotation/AuthorizationAnnotation";
import type { AttributeAdapter } from "../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import { AuthorizationFilters } from "../ast/filters/authorization-filters/AuthorizationFilters";
import type { AuthFilterFactory } from "./AuthFilterFactory";
type AuthParams = {
    entity: ConcreteEntityAdapter;
    operations: AuthorizationOperation[];
    context: Neo4jGraphQLTranslationContext;
};
type AuthFilterParams = AuthParams & {
    authAnnotation: AuthorizationAnnotation | undefined;
};
type AuthValidateParams = AuthParams & {
    when: ValidateWhen;
    conditionForEvaluation?: Cypher.Predicate;
    authAnnotation: AuthorizationAnnotation | undefined;
};
export declare class AuthorizationFactory {
    private filterFactory;
    constructor(filterFactory: AuthFilterFactory);
    getAuthFilters({ attributes, ...params }: AuthParams & {
        attributes?: AttributeAdapter[];
    }): AuthorizationFilters[];
    createAuthFilterRule({ authAnnotation, ...params }: AuthFilterParams): AuthorizationFilters | undefined;
    createAuthValidateRule({ authAnnotation, when, conditionForEvaluation, ...params }: AuthValidateParams): AuthorizationFilters | undefined;
    private createAuthRuleFilter;
}
export {};
