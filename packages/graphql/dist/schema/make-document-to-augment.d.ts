import type { DocumentNode, ObjectTypeDefinitionNode } from "graphql";
type DocumentToAugment = {
    document: DocumentNode;
    typesExcludedFromGeneration: {
        jwt?: {
            type: ObjectTypeDefinitionNode;
            jwtFieldsMap: Map<string, string>;
        };
    };
};
export declare function makeDocumentToAugment(document: DocumentNode): DocumentToAugment;
export {};
