import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { ConnectionFilter } from "../ConnectionFilter";
export declare class AuthConnectionFilter extends ConnectionFilter {
    protected createRelationshipOperation(pattern: Cypher.Pattern, queryASTContext: QueryASTContext): Cypher.Predicate | undefined;
}
