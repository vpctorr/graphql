import type { ValueNode } from "graphql";
import type { AttributeType } from "../attribute/AttributeType";
export declare class Argument {
    readonly name: string;
    readonly type: AttributeType;
    readonly defaultValue?: string;
    readonly description?: string;
    constructor({ name, type, defaultValue, description, }: {
        name: string;
        type: AttributeType;
        defaultValue?: ValueNode;
        description?: string;
    });
}
