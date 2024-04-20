import Cypher from "@neo4j/cypher-builder";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { EntitySelection } from "../selection/EntitySelection";
import { ReadOperation } from "./ReadOperation";
import type { OperationTranspileResult } from "./operations";
export declare class CypherOperation extends ReadOperation {
    private cypherAttributeField;
    constructor({ cypherAttributeField, target, relationship, selection, }: {
        cypherAttributeField: AttributeAdapter;
        target: ConcreteEntityAdapter;
        relationship?: RelationshipAdapter;
        selection: EntitySelection;
    });
    transpile(context: QueryASTContext<Cypher.Node | undefined>): OperationTranspileResult;
    private getReturnClause;
}
