import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import type { QueryASTNode } from "../QueryASTNode";
import type { FulltextScoreField } from "../fields/FulltextScoreField";
import type { EntitySelection } from "../selection/EntitySelection";
import { ReadOperation } from "./ReadOperation";
import type { OperationTranspileResult } from "./operations";
export type FulltextOptions = {
    index: string;
    phrase: string;
    score: Cypher.Variable;
};
export declare class FulltextOperation extends ReadOperation {
    private scoreField;
    constructor({ target, relationship, scoreField, selection, }: {
        target: ConcreteEntityAdapter;
        relationship?: RelationshipAdapter;
        scoreField: FulltextScoreField | undefined;
        selection: EntitySelection;
    });
    transpile(context: QueryASTContext<Cypher.Node | undefined>): OperationTranspileResult;
    getChildren(): QueryASTNode[];
    protected getReturnStatement(context: QueryASTContext, returnVariable: Cypher.Variable): Cypher.Return;
}
