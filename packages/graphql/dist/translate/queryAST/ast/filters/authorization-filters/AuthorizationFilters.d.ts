import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
import { Filter } from "../Filter";
import type { AuthorizationRuleFilter } from "./AuthorizationRuleFilter";
export declare class AuthorizationFilters extends Filter {
    private validationFilters;
    private whereFilters;
    private conditionForEvaluation;
    constructor({ validationFilters, whereFilters, conditionForEvaluation, }: {
        validationFilters: AuthorizationRuleFilter[];
        whereFilters: AuthorizationRuleFilter[];
        conditionForEvaluation?: Cypher.Predicate;
    });
    getPredicate(context: QueryASTContext): Cypher.Predicate | undefined;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSelection(context: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getChildren(): QueryASTNode[];
}
