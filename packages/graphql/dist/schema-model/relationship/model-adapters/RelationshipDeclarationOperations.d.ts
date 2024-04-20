import type { RelationshipDeclarationAdapter } from "./RelationshipDeclarationAdapter";
import { RelationshipBaseOperations } from "./RelationshipBaseOperations";
export declare class RelationshipDeclarationOperations extends RelationshipBaseOperations<RelationshipDeclarationAdapter> {
    constructor(relationshipDeclaration: RelationshipDeclarationAdapter);
    protected get fieldInputPrefixForTypename(): string;
    protected get edgePrefix(): string;
    get relationshipPropertiesFieldTypename(): string;
}
