import Cypher from "@neo4j/cypher-builder";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { Filter } from "../Filter";
import type { LogicalFilter } from "../LogicalFilter";
import type { AggregationPropertyFilter } from "./AggregationPropertyFilter";
import type { CountFilter } from "./CountFilter";
export declare class AggregationFilter extends Filter {
    private relationship;
    private filters;
    private subqueryReturnVariable;
    constructor(relationship: RelationshipAdapter);
    addFilters(...filter: Array<AggregationPropertyFilter | CountFilter | LogicalFilter>): void;
    getChildren(): QueryASTNode[];
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getPredicate(_queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
}
