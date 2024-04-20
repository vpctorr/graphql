import Cypher from "@neo4j/cypher-builder";
import type { Entity } from "../../../../../schema-model/entity/Entity";
import type { QueryASTNode } from "../../QueryASTNode";
import { AggregationField } from "./AggregationField";
export declare class CountField extends AggregationField {
    private entity;
    constructor({ alias, entity }: {
        alias: string;
        entity: Entity;
    });
    getChildren(): QueryASTNode[];
    getProjectionField(variable: Cypher.Variable): Record<string, Cypher.Expr>;
    getAggregationExpr(variable: Cypher.Variable): Cypher.Expr;
    getAggregationProjection(target: Cypher.Variable, returnVar: Cypher.Variable): Cypher.Clause;
}
