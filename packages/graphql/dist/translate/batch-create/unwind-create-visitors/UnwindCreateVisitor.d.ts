import Cypher from "@neo4j/cypher-builder";
import type { CallbackBucket } from "../../../classes/CallbackBucket";
import type { Neo4jGraphQLTranslationContext } from "../../../types/neo4j-graphql-translation-context";
import type { CreateAST, NestedCreateAST, UnwindASTNode, Visitor } from "../GraphQLInputAST/GraphQLInputAST";
type UnwindCreateScopeDefinition = {
    unwindVar: Cypher.Variable;
    parentVar: Cypher.Variable;
};
type GraphQLInputASTNodeRef = string;
type UnwindCreateEnvironment = Record<GraphQLInputASTNodeRef, UnwindCreateScopeDefinition>;
export declare class UnwindCreateVisitor implements Visitor<Cypher.Clause> {
    unwindVar: Cypher.Variable;
    callbackBucket: CallbackBucket;
    context: Neo4jGraphQLTranslationContext;
    rootNode: Cypher.Node | undefined;
    clause: Cypher.Clause | undefined;
    environment: UnwindCreateEnvironment;
    constructor(unwindVar: Cypher.Variable, callbackBucket: CallbackBucket, context: Neo4jGraphQLTranslationContext);
    visitChildren(currentASTNode: UnwindASTNode, unwindVar: Cypher.Variable, parentVar: Cypher.Variable): Cypher.Clause[];
    visitCreate(create: CreateAST): Cypher.Clause;
    visitNestedCreate(nestedCreate: NestedCreateAST): Cypher.Clause;
    private getAuthNodeClause;
    private getAuthorizationFieldClause;
    getScope(identifier: number): UnwindCreateScopeDefinition;
    build(): [Cypher.Node?, Cypher.Clause?];
}
export {};
