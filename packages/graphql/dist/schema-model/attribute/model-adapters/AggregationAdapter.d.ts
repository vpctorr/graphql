import type { AttributeAdapter } from "./AttributeAdapter";
import { AGGREGATION_COMPARISON_OPERATORS } from "../../../constants";
import type { ValueOf } from "../../../utils/value-of";
type ComparisonOperator = ValueOf<typeof AGGREGATION_COMPARISON_OPERATORS>;
export declare class AggregationAdapter {
    readonly AttributeAdapter: AttributeAdapter;
    constructor(AttributeAdapter: AttributeAdapter);
    getAggregationComparators(): string[];
    getAverageComparator(comparator: ComparisonOperator): string;
    getMinComparator(comparator: ComparisonOperator): string;
    getMaxComparator(comparator: ComparisonOperator): string;
    getSumComparator(comparator: ComparisonOperator): string;
}
export {};
