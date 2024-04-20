import type { IResolvers } from "@graphql-tools/utils";
import { type ASTVisitor } from "graphql";
import type { SDLValidationContext } from "graphql/validation/ValidationContext";
export declare const VALIDATE_OBJECT_FIELD_WARN_MSG = "Object types need a way to be resolved for field: ";
export declare function WarnObjectFieldsWithoutResolver({ customResolvers }: {
    customResolvers: Array<IResolvers>;
}): (context: SDLValidationContext) => ASTVisitor;
