import Cypher from "@neo4j/cypher-builder";
import { AttributeField } from "./AttributeField";
export declare class DateTimeField extends AttributeField {
    protected getCypherExpr(target: Cypher.Variable): Cypher.Expr;
    getProjectionField(variable: Cypher.Variable): Record<string, Cypher.Expr>;
    private createDateTimeProjection;
    private createArrayProjection;
    private createApocConvertFormat;
}
