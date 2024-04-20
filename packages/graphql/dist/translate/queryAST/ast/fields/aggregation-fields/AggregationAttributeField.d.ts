import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTNode } from "../../QueryASTNode";
import { AggregationField } from "./AggregationField";
export declare class AggregationAttributeField extends AggregationField {
    private attribute;
    private aggregationProjection;
    constructor({ alias, attribute, aggregationProjection, }: {
        alias: string;
        attribute: AttributeAdapter;
        aggregationProjection: Record<string, string>;
    });
    getChildren(): QueryASTNode[];
    getProjectionField(variable: Cypher.Variable): Record<string, Cypher.Expr>;
    getAggregationExpr(target: Cypher.Variable): Cypher.Expr;
    getAggregationProjection(target: Cypher.Variable, returnVar: Cypher.Variable): Cypher.Clause;
    private createAggregationExpr;
    private filterProjection;
    private createDatetimeProjection;
}
