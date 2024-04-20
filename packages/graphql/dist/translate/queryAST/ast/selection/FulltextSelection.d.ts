import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { QueryASTContext } from "../QueryASTContext";
import type { FulltextOptions } from "../operations/FulltextOperation";
import { EntitySelection, type SelectionClause } from "./EntitySelection";
export declare class FulltextSelection extends EntitySelection {
    private target;
    private fulltext;
    private scoreVariable;
    constructor({ target, fulltext, scoreVariable, }: {
        target: ConcreteEntityAdapter;
        fulltext: FulltextOptions;
        scoreVariable: Cypher.Variable;
    });
    apply(context: QueryASTContext): {
        nestedContext: QueryASTContext<Cypher.Node>;
        selection: SelectionClause;
    };
}
