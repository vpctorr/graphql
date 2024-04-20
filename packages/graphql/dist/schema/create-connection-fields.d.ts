import { Relationship } from "../classes";
import { ConcreteEntityAdapter } from "../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { ObjectFields } from "./get-obj-field-meta";
/**
 * TODO [translation-layer-compatibility]
 * this file only contains old Relationship class construction
 * safe to delete when no longer needed
 */
export declare function createConnectionFields({ entityAdapter, relationshipFields, }: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    relationshipFields: Map<string, ObjectFields>;
}): Relationship[];
