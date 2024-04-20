import type { Maybe } from "@graphql-tools/utils";
import type { DirectiveNode, FieldNode, GraphQLDirective, GraphQLField } from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap";
export declare function parseArgumentsFromUnknownDirective(directive: DirectiveNode): Record<string, unknown>;
/**
 * Polyfill of GraphQL-JS parseArguments, remove it after dropping the support of GraphQL-JS 15.0
 *
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export declare function parseArguments<T extends Record<string, unknown>>(def: GraphQLField<unknown, unknown> | GraphQLDirective, node: FieldNode | DirectiveNode, variableValues?: Maybe<ObjMap<unknown>>): T;
