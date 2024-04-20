import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { EntitySelection } from "../selection/EntitySelection";
import { Operation, type OperationTranspileResult } from "./operations";
/**
 * This operation is used to return top-level and nested @cypher fields that returns a scalar value.
 **/
export declare class CypherScalarOperation extends Operation {
    private selection;
    cypherAttributeField: AttributeAdapter;
    private isNested;
    constructor(selection: EntitySelection, cypherAttributeField: AttributeAdapter, isNested: boolean);
    getChildren(): QueryASTNode[];
    transpile(context: QueryASTContext<Cypher.Node | undefined>): OperationTranspileResult;
}
