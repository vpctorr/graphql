import type { Annotations } from "../../annotation/Annotation";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { RelationshipDeclarationAdapter } from "../../relationship/model-adapters/RelationshipDeclarationAdapter";
import type { InterfaceEntity } from "../InterfaceEntity";
import { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import { InterfaceEntityOperations } from "./InterfaceEntityOperations";
export declare class InterfaceEntityAdapter {
    readonly name: string;
    concreteEntities: ConcreteEntityAdapter[];
    readonly attributes: Map<string, AttributeAdapter>;
    readonly relationshipDeclarations: Map<string, RelationshipDeclarationAdapter>;
    readonly annotations: Partial<Annotations>;
    private uniqueFieldsKeys;
    private _singular;
    private _plural;
    private _operations;
    constructor(entity: InterfaceEntity);
    get globalIdField(): AttributeAdapter | undefined;
    get operations(): InterfaceEntityOperations;
    get singular(): string;
    get plural(): string;
    get upperFirstPlural(): string;
    getImplementationToAliasMapWhereAliased(attribute: AttributeAdapter): [string[], string][];
    get isReadable(): boolean;
    get isAggregable(): boolean;
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get uniqueFields(): AttributeAdapter[];
    get sortableFields(): AttributeAdapter[];
    get whereFields(): AttributeAdapter[];
    get aggregationWhereFields(): AttributeAdapter[];
    get aggregableFields(): AttributeAdapter[];
    get updateInputFields(): AttributeAdapter[];
    get subscriptionEventPayloadFields(): AttributeAdapter[];
    findAttribute(name: string): AttributeAdapter | undefined;
    findRelationshipDeclarations(name: string): RelationshipDeclarationAdapter | undefined;
    private initConcreteEntities;
    private initAttributes;
    private initRelationshipDeclarations;
}
