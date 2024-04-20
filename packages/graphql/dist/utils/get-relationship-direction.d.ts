import type { RelationField } from "../types";
type CypherRelationshipDirection = "left" | "right" | "undirected";
export declare function getCypherRelationshipDirection(relationField: RelationField, fieldArgs?: {
    directed?: boolean;
}): CypherRelationshipDirection;
export {};
