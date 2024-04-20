import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { QueryASTContext } from "../QueryASTContext";
import { EntitySelection, type SelectionClause } from "./EntitySelection";
export declare class NodeSelection extends EntitySelection {
    private target;
    private alias;
    private optional;
    private useContextTarget;
    constructor({ target, alias, optional, useContextTarget, }: {
        target: ConcreteEntityAdapter;
        alias?: string;
        optional?: boolean;
        useContextTarget?: boolean;
    });
    apply(context: QueryASTContext): {
        nestedContext: QueryASTContext<Cypher.Node>;
        selection: SelectionClause;
    };
}
