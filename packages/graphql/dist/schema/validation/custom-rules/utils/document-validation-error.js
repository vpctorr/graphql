import { GraphQLError } from "graphql";
export class DocumentValidationError extends Error {
    constructor(message, _path) {
        super(message);
        this.path = _path;
    }
}
export function assertValid(fn) {
    let isValid = true;
    let errorMsg, errorPath;
    try {
        fn();
    }
    catch (error) {
        isValid = false;
        errorMsg = error.message;
        errorPath = error.path || [];
    }
    return { isValid, errorMsg, errorPath };
}
export function createGraphQLError({ nodes, path, errorMsg, extensions, }) {
    const errorOpts = {
        nodes,
        path,
        source: undefined,
        positions: undefined,
        originalError: undefined,
        extensions,
    };
    // TODO: replace constructor to use errorOpts when dropping support for GraphQL15
    return new GraphQLError(errorMsg || "Error", errorOpts.nodes, errorOpts.source, errorOpts.positions, errorOpts.path, errorOpts.originalError, errorOpts.extensions);
}
