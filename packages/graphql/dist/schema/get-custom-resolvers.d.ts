import { type DocumentNode, type ObjectTypeDefinitionNode } from "graphql";
interface CustomResolvers {
    customQuery?: ObjectTypeDefinitionNode;
    customCypherQuery?: ObjectTypeDefinitionNode;
    customMutation?: ObjectTypeDefinitionNode;
    customCypherMutation?: ObjectTypeDefinitionNode;
    customSubscription?: ObjectTypeDefinitionNode;
}
declare function getCustomResolvers(document: DocumentNode): CustomResolvers;
export default getCustomResolvers;