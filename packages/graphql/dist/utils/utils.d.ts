import type { Integer } from "neo4j-driver";
/** Checks if value is string */
export declare function isString(value: unknown): value is string;
/** Checks if value is object (array not included) */
export declare function isObject(value: unknown): value is object;
/** Checks if value is a Record (Array and other BuiltIn Object not included)  */
export declare function isRecord(value: unknown): value is Record<string, any>;
/** Checks if two value have the same type */
export declare function isSameType<T>(a: T, b: unknown): b is T;
/** Checks if two objects have the number of properties */
export declare function haveSameLength(o1: Record<string, any>, o2: Record<string, any>): boolean;
/** Checks if value is a Neo4j int object */
export declare function isNeoInt(value: unknown): value is Integer;
/** Transforms a value to number, if possible */
export declare function toNumber(value: Integer | number): number;
/** Makes sure input is an array, if not it turns into an array (empty array if input is null or undefined) */
export declare function asArray<T>(raw: T | Array<T> | undefined | null): Array<T>;
/** Filter all elements in an array, only leaving truthy values */
export declare function filterTruthy<T>(arr: Array<T | null | undefined | void>): Array<T>;
/** Check if both arrays share at least one element */
export declare function haveSharedElement(arr1: Array<any>, arr2: Array<any>): boolean;
/** Removes duplicate elements of an array */
export declare function removeDuplicates<T>(arr: T[]): T[];
/** Awaitable version of setTimeout */
export declare function delay(ms: number): Promise<void>;
/** Omits fields from record */
export declare function omitFields<T>(obj: Record<string, T>, fields: string[]): Record<string, T>;
/** Keep only the provided fields from record */
export declare function filterFields<T>(obj: Record<string, T>, fieldsToKeep: string[]): Record<string, T>;
/** Rename the keys of given fields */
export declare function renameFields<T>(obj: Record<string, T>, fieldNameMap: Record<string, string>): Record<string, T>;
