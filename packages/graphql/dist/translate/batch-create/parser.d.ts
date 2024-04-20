import type { GraphQLCreateInput, TreeDescriptor } from "./types";
import type { Node, Relationship } from "../../classes";
import Cypher from "@neo4j/cypher-builder";
import { CreateAST } from "./GraphQLInputAST/GraphQLInputAST";
import type { Neo4jGraphQLTranslationContext } from "../../types/neo4j-graphql-translation-context";
export declare function inputTreeToCypherMap(input: GraphQLCreateInput[] | GraphQLCreateInput, node: Node, context: Neo4jGraphQLTranslationContext, parentKey?: string, relationship?: Relationship): Cypher.List | Cypher.Map;
export declare function getTreeDescriptor(input: GraphQLCreateInput, node: Node, context: Neo4jGraphQLTranslationContext, parentKey?: string, relationship?: Relationship): TreeDescriptor;
export declare function mergeTreeDescriptors(input: TreeDescriptor[]): TreeDescriptor;
export declare function parseCreate(input: TreeDescriptor, node: Node, context: Neo4jGraphQLTranslationContext, counter?: number): CreateAST;
