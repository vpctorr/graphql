import type { TypeDefinitionNode, DirectiveDefinitionNode } from "graphql";
import { GraphQLSchema, GraphQLDirective } from "graphql";
export declare function createAuthorizationDefinitions(typeDefinitionName: string, schema: GraphQLSchema): (TypeDefinitionNode | DirectiveDefinitionNode)[];
export declare const authorizationDirectiveScaffold: GraphQLDirective;
