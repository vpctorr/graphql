import type Cypher from "@neo4j/cypher-builder";
import { Field } from "../Field";
export declare abstract class AggregationField extends Field {
    abstract getProjectionField(_variable: Cypher.Variable): Record<string, Cypher.Expr>;
    abstract getAggregationExpr(variable: Cypher.Variable | Cypher.Property): Cypher.Expr;
    abstract getAggregationProjection(target: Cypher.Variable, returnVar: Cypher.Variable): Cypher.Clause;
}
