import type { DocumentNode, GraphQLDirective, GraphQLNamedType, ObjectTypeDefinitionNode } from "graphql";
import type { SDLValidationRule } from "graphql/validation/ValidationContext";
export declare function validateUserDefinition({ userDocument, augmentedDocument, additionalDirectives, additionalTypes, rules, jwt, }: {
    userDocument: DocumentNode;
    augmentedDocument: DocumentNode;
    additionalDirectives?: Array<GraphQLDirective>;
    additionalTypes?: Array<GraphQLNamedType>;
    rules?: readonly SDLValidationRule[];
    jwt?: ObjectTypeDefinitionNode;
}): void;
