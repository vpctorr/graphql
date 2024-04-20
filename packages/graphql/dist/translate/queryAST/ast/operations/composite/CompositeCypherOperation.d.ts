import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import type { EntitySelection } from "../../selection/EntitySelection";
import { Operation, type OperationTranspileResult } from "../operations";
import type { CompositeReadPartial } from "./CompositeReadPartial";
export declare class CompositeCypherOperation extends Operation {
    private selection;
    private partials;
    cypherAttributeField: AttributeAdapter;
    constructor({ selection, partials, cypherAttributeField, }: {
        selection: EntitySelection;
        partials: CompositeReadPartial[];
        cypherAttributeField: AttributeAdapter;
    });
    getChildren(): QueryASTNode[];
    transpile(context: QueryASTContext<Cypher.Node | undefined>): OperationTranspileResult;
    private getReturnExpression;
    private wrapWithCollectIfNeeded;
    private wrapWithHeadIfNeeded;
}
