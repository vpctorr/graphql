import type { Annotations } from "../../annotation/Annotation";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { RelationshipAdapter } from "../../relationship/model-adapters/RelationshipAdapter";
import type { CompositeEntity } from "../CompositeEntity";
import type { ConcreteEntity } from "../ConcreteEntity";
import type { EntityAdapter } from "../EntityAdapter";
import { ConcreteEntityOperations } from "./ConcreteEntityOperations";
export declare class ConcreteEntityAdapter {
    readonly name: string;
    readonly description?: string;
    readonly labels: Set<string>;
    readonly attributes: Map<string, AttributeAdapter>;
    readonly relationships: Map<string, RelationshipAdapter>;
    readonly annotations: Partial<Annotations>;
    readonly compositeEntities: CompositeEntity[];
    private mutableFieldsKeys;
    private uniqueFieldsKeys;
    private constrainableFieldsKeys;
    private _relatedEntities;
    private _singular;
    private _plural;
    private _globalIdField;
    private _operations;
    readonly entity: ConcreteEntity;
    constructor(entity: ConcreteEntity);
    private initAttributes;
    private initRelationships;
    findAttribute(name: string): AttributeAdapter | undefined;
    get isReadable(): boolean;
    get isAggregable(): boolean;
    get isCreatable(): boolean;
    get isUpdatable(): boolean;
    get isDeletable(): boolean;
    get isSubscribable(): boolean;
    get isSubscribableOnCreate(): boolean;
    get isSubscribableOnUpdate(): boolean;
    get isSubscribableOnDelete(): boolean;
    get isSubscribableOnRelationshipCreate(): boolean;
    get isSubscribableOnRelationshipDelete(): boolean;
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get mutableFields(): AttributeAdapter[];
    get uniqueFields(): AttributeAdapter[];
    get constrainableFields(): AttributeAdapter[];
    get relatedEntities(): EntityAdapter[];
    get objectFields(): AttributeAdapter[];
    get sortableFields(): AttributeAdapter[];
    get whereFields(): AttributeAdapter[];
    get aggregableFields(): AttributeAdapter[];
    get aggregationWhereFields(): AttributeAdapter[];
    get createInputFields(): AttributeAdapter[];
    get updateInputFields(): AttributeAdapter[];
    get arrayMethodFields(): AttributeAdapter[];
    get onCreateInputFields(): AttributeAdapter[];
    get temporalFields(): AttributeAdapter[];
    get subscriptionEventPayloadFields(): AttributeAdapter[];
    findRelationship(name: string): RelationshipAdapter | undefined;
    getLabels(): string[];
    getMainLabel(): string;
    get singular(): string;
    get plural(): string;
    get upperFirstPlural(): string;
    get operations(): ConcreteEntityOperations;
    get globalIdField(): AttributeAdapter | undefined;
    isGlobalNode(): this is this & {
        globalIdField: AttributeAdapter;
    };
    toGlobalId(id: string | number): string;
}
