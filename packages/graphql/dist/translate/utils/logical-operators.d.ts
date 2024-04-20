import Cypher from "@neo4j/cypher-builder";
import { LOGICAL_OPERATORS } from "../../constants";
import type { ValueOf } from "../../utils/value-of";
type LogicalOperator = ValueOf<typeof LOGICAL_OPERATORS>;
export declare function getLogicalPredicate(graphQLOperator: LogicalOperator, predicates: Cypher.Predicate[]): Cypher.Predicate | undefined;
export declare function isLogicalOperator(key: unknown): key is LogicalOperator;
export {};
