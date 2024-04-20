import type { DirectiveNode, FieldDefinitionNode, ASTNode, GraphQLErrorExtensions } from "graphql";
import { GraphQLError } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "./path-parser";
export type AssertionResponse = {
    isValid: boolean;
    errorMsg?: string;
    errorPath: ReadonlyArray<string | number>;
};
export type ValidationFunction = ({ directiveNode, traversedDef, parentDef, }: {
    directiveNode: DirectiveNode;
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
    parentDef?: ObjectOrInterfaceWithExtensions;
}) => void | undefined;
export declare class DocumentValidationError extends Error {
    path: string[];
    constructor(message: string, _path: string[]);
}
export declare function assertValid(fn: () => void | undefined): AssertionResponse;
export declare function createGraphQLError({ nodes, path, errorMsg, extensions, }: {
    nodes?: ASTNode[] | readonly ASTNode[];
    path?: (string | number)[] | readonly (string | number)[];
    errorMsg?: string;
    extensions?: GraphQLErrorExtensions;
}): GraphQLError;
