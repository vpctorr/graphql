import type { Maybe } from "@graphql-tools/utils";
import type { DocumentNode, GraphQLSchema, GraphQLError } from "graphql";
import type { SDLValidationRule } from "graphql/validation/ValidationContext";
export declare function validateSDL(documentAST: DocumentNode, rules: ReadonlyArray<SDLValidationRule>, schemaToExtend?: Maybe<GraphQLSchema>): ReadonlyArray<GraphQLError>;
