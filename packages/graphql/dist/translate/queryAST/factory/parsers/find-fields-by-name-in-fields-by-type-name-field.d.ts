import type { FieldsByTypeName, ResolveTree } from "graphql-parse-resolve-info";
/**
 *  Given a `FieldsByTypeName` object field and a field name to search, return an array of `ResolveTree`s with the matched fields.
 **/
export declare function findFieldsByNameInFieldsByTypeNameField(fieldsByTypeNameField: FieldsByTypeName[string], fieldName: string): ResolveTree[];
