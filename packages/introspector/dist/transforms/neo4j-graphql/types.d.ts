export type Direction = "IN" | "OUT";
export interface Directive {
    toString(): string;
}
export type ExcludeOperation = "CREATE" | "READ" | "UPDATE" | "DELETE";
