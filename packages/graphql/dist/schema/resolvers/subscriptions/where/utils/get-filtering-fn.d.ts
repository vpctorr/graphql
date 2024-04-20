import type { AttributeAdapter } from "../../../../../schema-model/attribute/model-adapters/AttributeAdapter";
type ComparatorFn<T> = (received: T, filtered: T, fieldMeta?: AttributeAdapter | undefined) => boolean;
export declare function getFilteringFn<T>(operator: string | undefined, overrides?: Record<string, (received: any, filtered: any, fieldMeta?: any) => boolean>): ComparatorFn<T>;
export {};
