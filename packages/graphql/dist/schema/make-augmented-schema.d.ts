import type { IResolvers } from "@graphql-tools/utils";
import type { DocumentNode } from "graphql";
import type { Node } from "../classes";
import type Relationship from "../classes/Relationship";
import type { Subgraph } from "../classes/Subgraph";
import type { Neo4jGraphQLSchemaModel } from "../schema-model/Neo4jGraphQLSchemaModel";
import type { Neo4jFeaturesSettings } from "../types";
declare function makeAugmentedSchema({ document, features, userCustomResolvers, subgraph, schemaModel, }: {
    document: DocumentNode;
    features?: Neo4jFeaturesSettings;
    userCustomResolvers?: IResolvers | Array<IResolvers>;
    subgraph?: Subgraph;
    schemaModel: Neo4jGraphQLSchemaModel;
}): {
    nodes: Node[];
    relationships: Relationship[];
    typeDefs: DocumentNode;
    resolvers: IResolvers;
};
export default makeAugmentedSchema;
