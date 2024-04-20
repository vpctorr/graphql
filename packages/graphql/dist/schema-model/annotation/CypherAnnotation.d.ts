import type { Annotation } from "./Annotation";
export declare class CypherAnnotation implements Annotation {
    readonly name = "cypher";
    statement: string;
    columnName: string;
    constructor({ statement, columnName }: {
        statement: string;
        columnName: string;
    });
}
