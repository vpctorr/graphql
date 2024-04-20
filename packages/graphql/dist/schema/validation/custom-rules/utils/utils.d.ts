import type { ArgumentNode, EnumTypeDefinitionNode, FieldDefinitionNode, TypeNode, ValueNode } from "graphql";
import * as neo4j from "neo4j-driver";
export declare function getInnerTypeName(typeNode: TypeNode): string;
export declare function fromValueKind(valueNode: ValueNode, enums: EnumTypeDefinitionNode[], expectedType: string): string | undefined;
export declare function getPrettyName(typeNode: TypeNode): string;
export declare function parseArgumentToInt(arg: ArgumentNode | undefined): neo4j.Integer | undefined;
export declare function isArrayType(traversedDef: FieldDefinitionNode): boolean;
