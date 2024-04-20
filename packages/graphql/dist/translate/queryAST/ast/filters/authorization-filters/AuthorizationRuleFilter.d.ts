import Cypher from "@neo4j/cypher-builder";
import { Filter } from "../Filter";
import type { QueryASTContext } from "../../QueryASTContext";
import type { QueryASTNode } from "../../QueryASTNode";
export declare class AuthorizationRuleFilter extends Filter {
    children: Filter[];
    private requireAuthentication;
    private isAuthenticatedParam;
    constructor({ requireAuthentication, filters, isAuthenticatedParam, }: {
        requireAuthentication: boolean;
        filters: Filter[];
        isAuthenticatedParam: Cypher.Param;
    });
    getPredicate(context: QueryASTContext): Cypher.Predicate | undefined;
    getSubqueries(context: QueryASTContext): Cypher.Clause[];
    getSelection(context: QueryASTContext): Array<Cypher.Match | Cypher.With>;
    getChildren(): QueryASTNode[];
}
