import type { Neo4jGraphQLContext } from "../types/neo4j-graphql-context";
export interface NodeDirectiveConstructor {
    labels?: string[];
}
export declare class NodeDirective {
    readonly labels: string[];
    constructor(input: NodeDirectiveConstructor);
    getLabelsString(typeName: string, context: Neo4jGraphQLContext): string;
    /**
     * Returns the list containing labels mapped with the values contained in the Context.
     * Be careful when using this method, labels returned are unescaped.
     **/
    getLabels(typeName: string, context: Neo4jGraphQLContext): string[];
}
