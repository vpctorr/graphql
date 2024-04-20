import type { FieldDefinitionNode } from "graphql";
import type { ObjectOrInterfaceWithExtensions } from "../utils/path-parser";
export declare function verifyTimestamp({ traversedDef, }: {
    traversedDef: ObjectOrInterfaceWithExtensions | FieldDefinitionNode;
}): void;
