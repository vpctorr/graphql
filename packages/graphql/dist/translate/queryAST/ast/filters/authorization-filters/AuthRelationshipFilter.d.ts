import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { RelationshipFilter } from "../RelationshipFilter";
export declare class AuthRelationshipFilter extends RelationshipFilter {
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
    protected createRelationshipOperation(pattern: Cypher.Pattern, queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
}
