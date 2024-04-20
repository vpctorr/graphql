import type { WhereOperator } from "./types";
export declare const whereRegEx: RegExp;
export type WhereRegexGroups = {
    fieldName: string;
    isAggregate?: string;
    operator?: WhereOperator;
    prefix?: string;
};
