import type { ASTVisitor } from "graphql";
import type { Neo4jAuthorizationSettings } from "../../../../types";
export declare function WarnIfAuthorizationFeatureDisabled(authorization: Neo4jAuthorizationSettings | undefined): () => ASTVisitor;
