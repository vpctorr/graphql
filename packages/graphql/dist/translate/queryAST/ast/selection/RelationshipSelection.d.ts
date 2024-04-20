import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../QueryASTContext";
import { EntitySelection, type SelectionClause } from "./EntitySelection";
export declare class RelationshipSelection extends EntitySelection {
    private relationship;
    private targetOverride;
    private alias;
    private directed?;
    private optional;
    constructor({ relationship, alias, directed, targetOverride, optional, }: {
        relationship: RelationshipAdapter;
        alias?: string;
        directed?: boolean;
        targetOverride?: ConcreteEntityAdapter;
        optional?: boolean;
    });
    apply(context: QueryASTContext<Cypher.Node>): {
        nestedContext: QueryASTContext<Cypher.Node>;
        selection: SelectionClause;
    };
}
