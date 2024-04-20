import type { PredicateReturn } from "../../../types";
type CompiledPredicateReturn = {
    cypher: string;
    params: Record<string, any>;
    subqueries?: string;
};
/**
 * Compiles Cypher, parameters and subqueries in the same Cypher Builder environment.
 *
 * The subqueries contain variables required by the predicate, and if they are not compiled with the same
 * environment, the predicate will be referring to non-existent variables and will re-assign variable from the subqueries.
 */
export declare function compilePredicateReturn(predicateReturn: PredicateReturn, indexPrefix?: string): CompiledPredicateReturn;
export {};
