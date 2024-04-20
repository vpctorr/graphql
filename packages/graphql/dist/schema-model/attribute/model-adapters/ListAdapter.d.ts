import type { AttributeAdapter } from "./AttributeAdapter";
export declare class ListAdapter {
    readonly AttributeAdapter: AttributeAdapter;
    constructor(AttributeAdapter: AttributeAdapter);
    getPush(): string;
    getPop(): string;
    getIncludes(): string;
    getNotIncludes(): string;
}
