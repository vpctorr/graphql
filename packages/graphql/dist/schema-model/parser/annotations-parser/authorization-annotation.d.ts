import type { DirectiveNode } from "graphql";
import { AuthorizationAnnotation } from "../../annotation/AuthorizationAnnotation";
export declare function parseAuthorizationAnnotation(directive: DirectiveNode): AuthorizationAnnotation;
