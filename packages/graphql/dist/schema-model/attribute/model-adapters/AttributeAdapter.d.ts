import type { Annotations } from "../../annotation/Annotation";
import type { Argument } from "../../argument/Argument";
import type { Attribute } from "../Attribute";
import type { AttributeType } from "../AttributeType";
import { AttributeTypeHelper } from "../AttributeTypeHelper";
import { AggregationAdapter } from "./AggregationAdapter";
import { ListAdapter } from "./ListAdapter";
import { MathAdapter } from "./MathAdapter";
export declare class AttributeAdapter {
    private _listModel;
    private _mathModel;
    private _aggregationModel;
    typeHelper: AttributeTypeHelper;
    readonly name: string;
    readonly annotations: Partial<Annotations>;
    readonly type: AttributeType;
    readonly args: Argument[];
    readonly databaseName: string;
    readonly description?: string;
    constructor(attribute: Attribute);
    get listModel(): ListAdapter | undefined;
    get mathModel(): MathAdapter | undefined;
    get aggregationModel(): AggregationAdapter;
    /**
     * Categories Filters
     * each Attribute has the knowledge of whether it is part of a category
     *
     */
    isMutable(): boolean;
    isUnique(): boolean;
    isCypher(): boolean;
    isConstrainable(): boolean;
    isObjectField(): boolean;
    isSortableField(): boolean;
    isWhereField(): boolean;
    isEventPayloadField(): boolean;
    isSubscriptionConnectedRelationshipField(): boolean;
    isOnCreateField(): boolean;
    isNumericalOrTemporal(): boolean;
    isAggregableField(): boolean;
    isAggregationWhereField(): boolean;
    isCreateInputField(): boolean;
    isUpdateInputField(): boolean;
    timestampCreateIsGenerated(): boolean;
    populatedByCreateIsGenerated(): boolean;
    isNonGeneratedField(): boolean;
    timestampUpdateIsGenerated(): boolean;
    populatedByUpdateIsGenerated(): boolean;
    isArrayMethodField(): boolean;
    /**
     * Category Helpers
     *
     */
    getDefaultValue(): import("../../annotation/DefaultAnnotation").DefaultAnnotationValue | undefined;
    isReadable(): boolean;
    isAggregable(): boolean;
    isAggregationFilterable(): boolean;
    isFilterable(): boolean;
    isCustomResolvable(): boolean;
    isGlobalIDAttribute(): boolean;
    /**
     * Type names
     * used to create different types for the Attribute or Entity that contains the Attributes
     */
    getTypePrettyName(): string;
    getTypeName(): string;
    getFieldTypeName(): string;
    getInputTypeName(): string;
    getFilterableInputTypeName(): string;
    getInputTypeNames(): InputTypeNames;
    getAggregateSelectionTypeName(): string;
}
type InputTypeNames = Record<"where" | "create" | "update", {
    type: string;
    pretty: string;
}>;
export {};
