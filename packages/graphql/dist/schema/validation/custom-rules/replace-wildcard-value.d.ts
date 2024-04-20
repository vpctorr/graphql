import type { ASTVisitor, GraphQLSchema, ObjectTypeDefinitionNode } from "graphql";
export declare function makeReplaceWildcardVisitor({ jwt, schema }: {
    jwt?: ObjectTypeDefinitionNode;
    schema: GraphQLSchema;
}): () => ASTVisitor;
