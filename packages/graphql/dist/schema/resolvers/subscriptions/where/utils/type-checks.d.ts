import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { PrimitiveField } from "../../../../../types";
import type { InterfaceSpecificType, InterfaceType, StandardType } from "../../types";
export declare function isIDAsString(fieldMeta: PrimitiveField | undefined, value: string | number): boolean;
export declare function isInterfaceType(node: StandardType | InterfaceType, receivedEventRelationship: RelationshipAdapter): node is InterfaceType;
export declare function isStandardType(node: StandardType | InterfaceType, receivedEventRelationship: RelationshipAdapter): node is StandardType;
export declare function isInterfaceSpecificFieldType(node: unknown): node is InterfaceSpecificType;
