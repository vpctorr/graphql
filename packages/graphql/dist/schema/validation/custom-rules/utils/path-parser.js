import { Kind } from "graphql";
/**
 * This function is called with the path and ancestors arguments from a GraphQL visitor.
 * It parses the arguments to identify some information about the latest definitions traversed by the visitor.
 *
 * @returns [pathToHere, traversedDef, parentOfTraversedDef]
 *  * pathToHere is a list of the names of all definitions that were traversed by the visitor to get to the node that is being visited (not inclusive)
 *  * traversedDef is the last definition before the node that is being visited
 *  * parentOfTraversedDef is the parent of traversedDef
 */
export function getPathToNode(path, ancestors) {
    if (!ancestors || !ancestors[0] || Array.isArray(ancestors[0])) {
        return [[], undefined, undefined];
    }
    let traversedDefinition, pathIdx;
    const visitStartedFromDocumentLevel = ancestors[0].kind === Kind.DOCUMENT;
    if (visitStartedFromDocumentLevel) {
        const documentASTNodes = ancestors[1];
        if (!documentASTNodes || (Array.isArray(documentASTNodes) && !documentASTNodes.length)) {
            return [[], undefined, undefined];
        }
        const [, definitionIdx] = path;
        traversedDefinition = documentASTNodes[definitionIdx];
        pathIdx = 2;
    }
    else {
        // visit started from inside another visitor
        traversedDefinition = ancestors[0];
        pathIdx = 0;
    }
    const pathToHere = [traversedDefinition];
    let lastSeenDefinition = traversedDefinition;
    const getNextDefinition = parsePath(path, traversedDefinition, pathIdx);
    for (const definition of getNextDefinition()) {
        lastSeenDefinition = definition;
        pathToHere.push(definition);
    }
    const parentOfLastSeenDefinition = pathToHere.slice(-2)[0];
    return [pathToHere.map((n) => n.name?.value || "Schema"), lastSeenDefinition, parentOfLastSeenDefinition];
}
function parsePath(path, traversedDefinition, startingIdx) {
    return function* getNextDefinition(idx = startingIdx) {
        while (path[idx] && path[idx] !== "directives") {
            // continue parsing for annotated fields
            const key = path[idx];
            const idxAtKey = path[idx + 1];
            traversedDefinition = traversedDefinition[key][idxAtKey];
            yield traversedDefinition;
            idx += 2;
        }
    };
}
