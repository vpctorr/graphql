import Cypher from "@neo4j/cypher-builder";
import type { QueryASTContext } from "../../QueryASTContext";
import { PropertyFilter } from "./PropertyFilter";
import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
import type { FilterOperator } from "../Filter";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
type CypherVariable = Cypher.Variable | Cypher.Property | Cypher.Param;
/** A property which comparison has already been parsed into a Param */
export declare class ParamPropertyFilter extends PropertyFilter {
    protected comparisonValue: CypherVariable;
    constructor(options: {
        attribute: AttributeAdapter;
        comparisonValue: CypherVariable;
        operator: FilterOperator;
        isNot: boolean;
        attachedTo?: "node" | "relationship";
        relationship?: RelationshipAdapter;
    });
    getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate;
    protected getOperation(prop: Cypher.Property): Cypher.ComparisonOp;
}
export {};
