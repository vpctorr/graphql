export type SelectionSetFieldRegexGroups = {
    fieldName: string;
    isConnection: boolean;
    isAggregation: boolean;
};
export declare function parseSelectionSetField(field: string): SelectionSetFieldRegexGroups;
