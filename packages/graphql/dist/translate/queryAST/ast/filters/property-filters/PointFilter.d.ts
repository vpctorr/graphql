import Cypher from "@neo4j/cypher-builder";
import { PropertyFilter } from "./PropertyFilter";
export declare class PointFilter extends PropertyFilter {
    protected getOperation(prop: Cypher.Property): Cypher.ComparisonOp;
    private createPointOperation;
    private createPointListComprehension;
    private createPointDistanceExpression;
}
