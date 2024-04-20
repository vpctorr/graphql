import type Node from "./classes/Node";
import type Relationship from "./classes/Relationship";
export type Neo4jStruct = {
    nodes: Record<string, Node>;
    relationships: Record<string, Relationship>;
};
export type PropertyRecord = {
    propertyName: string;
    propertyTypes: string[];
    mandatory: boolean;
};
export type NodeMap = {
    [key: string]: Node;
};
export type RelationshipMap = {
    [key: string]: Relationship;
};
