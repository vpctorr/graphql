import type { Predicate } from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import type { FilterOperator } from "../Filter";
import { Filter } from "../Filter";
import Cypher from "@neo4j/cypher-builder";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class JWTFilter extends Filter {
    protected operator: FilterOperator;
    protected JWTClaim: Cypher.Property;
    protected comparisonValue: unknown;
    protected isNot: boolean;
    constructor({ operator, JWTClaim, comparisonValue, isNot, }: {
        operator: FilterOperator;
        JWTClaim: Cypher.Property;
        comparisonValue: unknown;
        isNot: boolean;
    });
    getChildren(): QueryASTNode[];
    getPredicate(_context: QueryASTContext): Predicate | undefined;
    print(): string;
    private wrapInNotIfNeeded;
}
