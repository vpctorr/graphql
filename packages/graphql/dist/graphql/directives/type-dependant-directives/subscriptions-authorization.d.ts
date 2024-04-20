import type { DirectiveDefinitionNode, TypeDefinitionNode } from "graphql";
import { GraphQLDirective, GraphQLSchema } from "graphql";
export declare function createSubscriptionsAuthorizationDefinitions(typeDefinitionName: string, schema: GraphQLSchema): (TypeDefinitionNode | DirectiveDefinitionNode)[];
export declare const subscriptionsAuthorizationDirectiveScaffold: GraphQLDirective;
