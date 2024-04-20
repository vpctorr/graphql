import type { ASTVisitor } from "graphql";
import type { SDLValidationContext } from "graphql/validation/ValidationContext";
export declare function DirectiveCombinationValid(context: SDLValidationContext): ASTVisitor;
export declare function SchemaOrTypeDirectives(context: SDLValidationContext): ASTVisitor;
