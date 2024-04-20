/**
 * Type matching the elements in object/array
 */
export type ValueOf<T extends ReadonlyArray<unknown> | Array<unknown>> = T[number];
