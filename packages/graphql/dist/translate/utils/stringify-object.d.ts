import Cypher from "@neo4j/cypher-builder";
/** Serializes object into a string for Cypher objects */
export declare function stringifyObject(fields: Record<string, Cypher.Raw | string | undefined | null>): Cypher.Raw;
