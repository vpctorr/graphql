import Cypher from "@neo4j/cypher-builder";
import { PropertyFilter } from "./PropertyFilter";
export declare class DurationFilter extends PropertyFilter {
    protected getOperation(prop: Cypher.Property): Cypher.ComparisonOp;
    private createDurationOperation;
}
