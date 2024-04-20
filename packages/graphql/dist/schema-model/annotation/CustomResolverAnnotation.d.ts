import type { DocumentNode, FieldDefinitionNode } from "graphql";
import type { ResolveTree } from "graphql-parse-resolve-info";
import type { Annotation } from "./Annotation";
export declare class CustomResolverAnnotation implements Annotation {
    readonly name = "customResolver";
    readonly requires: string | undefined;
    parsedRequires: Record<string, ResolveTree> | undefined;
    constructor({ requires }: {
        requires: string | undefined;
    });
    parseRequire(document: DocumentNode, objectFields?: ReadonlyArray<FieldDefinitionNode>): void;
}
