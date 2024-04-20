import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
/** Returns true if receivedProperties comply with filters specified in whereProperties, false otherwise. */
export declare function filterByProperties<T>({ attributes, whereProperties, receivedProperties, }: {
    attributes: Map<string, AttributeAdapter>;
    whereProperties: Record<string, T | Array<Record<string, T>> | Record<string, T>>;
    receivedProperties: Record<string, T>;
}): boolean;
