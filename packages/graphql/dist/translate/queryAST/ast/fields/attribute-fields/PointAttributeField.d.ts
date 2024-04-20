import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import { AttributeField } from "./AttributeField";
export declare class PointAttributeField extends AttributeField {
    private crs;
    constructor({ attribute, alias, crs }: {
        attribute: AttributeAdapter;
        alias: string;
        crs: boolean;
    });
    getProjectionField(variable: Cypher.Variable): Record<string, Cypher.Expr>;
    protected getCypherExpr(target: Cypher.Variable): Cypher.Expr;
    private createPointProjection;
    private createPointArrayProjection;
    private createPointProjectionMap;
}
