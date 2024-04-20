import type { LogicalOperators, WhereOperator } from "../../ast/filters/Filter";
export type WhereRegexGroups = {
    fieldName: string;
    isAggregate: boolean;
    operator: WhereOperator | undefined;
    prefix?: string;
    isNot: boolean;
    isConnection: boolean;
};
export declare const whereRegEx: RegExp;
export declare function parseWhereField(field: string): WhereRegexGroups;
type ConnectionWhereArgField = {
    isNot: boolean;
    fieldName: "node" | "edge" | LogicalOperators;
};
export declare function parseConnectionWhereFields(key: string): ConnectionWhereArgField;
export declare const aggregationFieldRegEx: RegExp;
export type AggregationOperator = "AVERAGE" | "SHORTEST" | "LONGEST" | "MIN" | "MAX" | "SUM";
export type AggregationLogicalOperator = "EQUAL" | "GT" | "GTE" | "LT" | "LTE";
export type AggregationFieldRegexGroups = {
    fieldName: string;
    aggregationOperator?: AggregationOperator;
    logicalOperator?: AggregationLogicalOperator;
};
export declare function parseAggregationWhereFields(field: string): AggregationFieldRegexGroups;
export {};
