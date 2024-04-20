import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTNode } from "../../QueryASTNode";
import { Field } from "../Field";
import type Cypher from "@neo4j/cypher-builder";
export declare class AttributeField extends Field {
    protected attribute: AttributeAdapter;
    constructor({ alias, attribute }: {
        alias: string;
        attribute: AttributeAdapter;
    });
    getChildren(): QueryASTNode[];
    getFieldName(): string;
    protected getCypherExpr(target: Cypher.Variable): Cypher.Expr;
    getProjectionField(variable: Cypher.Variable): string | Record<string, Cypher.Expr>;
    private createAttributeProperty;
}
