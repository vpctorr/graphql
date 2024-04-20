import type { FieldsByTypeName, ResolveTree } from "graphql-parse-resolve-info";
/**
 * Given a `ResolveTree` or array of `ResolveTree`s and a list of typeNames, return a `FieldsByTypeName` object field with the matched fields.
 */
export declare function getFieldsByTypeName(resolveTree: ResolveTree | ResolveTree[], typeNames: string | string[]): FieldsByTypeName[string];
