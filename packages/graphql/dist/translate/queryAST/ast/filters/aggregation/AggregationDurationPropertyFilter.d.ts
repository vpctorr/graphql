import Cypher from "@neo4j/cypher-builder";
import { AggregationPropertyFilter } from "./AggregationPropertyFilter";
export declare class AggregationDurationFilter extends AggregationPropertyFilter {
    protected getOperation(expr: Cypher.Expr): Cypher.ComparisonOp;
    private createDurationOperation;
}
