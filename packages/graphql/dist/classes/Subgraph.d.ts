import type { IResolvers, TypeSource } from "@graphql-tools/utils";
import type { DocumentNode, GraphQLDirective, GraphQLNamedType } from "graphql";
import type { Neo4jGraphQLSchemaModel } from "../schema-model/Neo4jGraphQLSchemaModel";
import type { ValueOf } from "../utils/value-of";
declare const federationDirectiveNames: readonly ["key", "extends", "shareable", "inaccessible", "override", "external", "provides", "requires", "tag", "composeDirective", "interfaceObject"];
type FederationDirectiveName = ValueOf<typeof federationDirectiveNames>;
export declare class Subgraph {
    private importArgument;
    private typeDefs;
    private linkExtension;
    constructor(typeDefs: TypeSource);
    getFullyQualifiedDirectiveName(name: FederationDirectiveName): string;
    buildSchema({ typeDefs, resolvers }: {
        typeDefs: DocumentNode;
        resolvers: Record<string, any>;
    }): import("graphql").GraphQLSchema;
    getReferenceResolvers(schemaModel: Neo4jGraphQLSchemaModel): IResolvers;
    private getReferenceResolver;
    getValidationDefinitions(): {
        directives: Array<GraphQLDirective>;
        types: Array<GraphQLNamedType>;
    };
    private findFederationLinkMeta;
    private trimDirectiveName;
    private parseLinkImportArgument;
}
export {};
