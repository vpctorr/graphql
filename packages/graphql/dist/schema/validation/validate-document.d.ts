import { type IResolvers } from "@graphql-tools/utils";
import type { DocumentNode, EnumTypeDefinitionNode, GraphQLDirective, GraphQLNamedType, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, UnionTypeDefinitionNode } from "graphql";
import type { Neo4jFeaturesSettings } from "../../types";
declare function validateDocument({ document, features, additionalDefinitions, userCustomResolvers, }: {
    document: DocumentNode;
    features: Neo4jFeaturesSettings | undefined;
    additionalDefinitions: {
        additionalDirectives?: Array<GraphQLDirective>;
        additionalTypes?: Array<GraphQLNamedType>;
        enums?: EnumTypeDefinitionNode[];
        interfaces?: InterfaceTypeDefinitionNode[];
        unions?: UnionTypeDefinitionNode[];
        objects?: ObjectTypeDefinitionNode[];
    };
    userCustomResolvers?: IResolvers | Array<IResolvers>;
}): void;
export default validateDocument;
