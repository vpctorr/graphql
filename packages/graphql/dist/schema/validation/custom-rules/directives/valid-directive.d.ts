import type { ASTVisitor, EnumTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, UnionTypeDefinitionNode } from "graphql";
import type { SDLValidationContext } from "graphql/validation/ValidationContext";
import type { Neo4jGraphQLCallbacks } from "../../../../types";
export declare function directiveIsValid(extra: {
    enums?: EnumTypeDefinitionNode[];
    interfaces?: InterfaceTypeDefinitionNode[];
    unions?: UnionTypeDefinitionNode[];
    objects?: ObjectTypeDefinitionNode[];
}, callbacks?: Neo4jGraphQLCallbacks): (context: SDLValidationContext) => ASTVisitor;
