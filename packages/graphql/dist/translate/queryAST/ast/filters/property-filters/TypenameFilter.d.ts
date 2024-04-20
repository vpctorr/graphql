import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { Filter } from "../Filter";
import type { ConcreteEntityAdapter } from "../../../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare class TypenameFilter extends Filter {
    private readonly acceptedEntities;
    constructor(acceptedEntities: ConcreteEntityAdapter[]);
    getChildren(): QueryASTNode[];
    print(): string;
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate;
}
