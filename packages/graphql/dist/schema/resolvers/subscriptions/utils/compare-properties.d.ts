/**
 * Returns true if all properties in obj1 exists in obj2, false otherwise.
 * Properties can only be primitives or Array<primitive>
 */
export declare function compareProperties(obj1: Record<string, any>, obj2: Record<string, any>): boolean;