import type { AttributeAdapter } from "./AttributeAdapter";
export declare class MathAdapter {
    readonly AttributeAdapter: AttributeAdapter;
    constructor(AttributeAdapter: AttributeAdapter);
    getMathOperations(): string[];
    getAdd(): string;
    getSubtract(): string;
    getMultiply(): string;
    getDivide(): string;
}
