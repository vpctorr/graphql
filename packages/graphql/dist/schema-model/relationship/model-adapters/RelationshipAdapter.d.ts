import type { Annotations } from "../../annotation/Annotation";
import type { Argument } from "../../argument/Argument";
import { AttributeAdapter } from "../../attribute/model-adapters/AttributeAdapter";
import { ListFiltersAdapter } from "../../attribute/model-adapters/ListFiltersAdapter";
import type { EntityAdapter } from "../../entity/EntityAdapter";
import { ConcreteEntityAdapter } from "../../entity/model-adapters/ConcreteEntityAdapter";
import type { NestedOperation, QueryDirection, Relationship, RelationshipDirection } from "../Relationship";
import { RelationshipOperations } from "./RelationshipOperations";
export declare class RelationshipAdapter {
    private _listFiltersModel;
    readonly name: string;
    readonly type: string;
    readonly attributes: Map<string, AttributeAdapter>;
    readonly source: EntityAdapter;
    private rawEntity;
    private rawOriginalTargetEntity?;
    private _target;
    readonly direction: RelationshipDirection;
    readonly queryDirection: QueryDirection;
    readonly nestedOperations: Set<NestedOperation>;
    readonly aggregate: boolean;
    readonly isNullable: boolean;
    readonly description?: string;
    readonly propertiesTypeName: string | undefined;
    readonly firstDeclaredInTypeName: string | undefined;
    readonly isList: boolean;
    readonly annotations: Partial<Annotations>;
    readonly args: Argument[];
    readonly siblings?: string[];
    private _singular;
    private _plural;
    private _operations;
    constructor(relationship: Relationship, sourceAdapter?: EntityAdapter);
    get operations(): RelationshipOperations;
    get listFiltersModel(): ListFiltersAdapter | undefined;
    get singular(): string;
    get plural(): string;
    private initAttributes;
    findAttribute(name: string): AttributeAdapter | undefined;
    /**
     * translation-only
     *
     * @param directed the direction asked during the query, for instance "friends(directed: true)"
     * @returns the direction to use in the CypherBuilder
     **/
    getCypherDirection(directed?: boolean): "left" | "right" | "undirected";
    private cypherDirectionFromRelDirection;
    get target(): EntityAdapter;
    get originalTarget(): EntityAdapter | undefined;
    isReadable(): boolean;
    isFilterableByValue(): boolean;
    isFilterableByAggregate(): boolean;
    isAggregable(): boolean;
    isCreatable(): boolean;
    isUpdatable(): boolean;
    shouldGenerateFieldInputType(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): boolean;
    shouldGenerateUpdateFieldInputType(ifUnionRelationshipTargetEntity?: ConcreteEntityAdapter): boolean;
    get hasNonNullCreateInputFields(): boolean;
    get hasCreateInputFields(): boolean;
    get hasUpdateInputFields(): boolean;
    get hasAnyProperties(): boolean;
    /**
     * Categories
     * = a grouping of attributes
     * used to generate different types for the Entity that contains these Attributes
     */
    get aggregableFields(): AttributeAdapter[];
    get aggregationWhereFields(): AttributeAdapter[];
    get createInputFields(): AttributeAdapter[];
    get updateInputFields(): AttributeAdapter[];
    get sortableFields(): AttributeAdapter[];
    get whereFields(): AttributeAdapter[];
    get subscriptionConnectedRelationshipFields(): AttributeAdapter[];
}
