import type { Annotations } from "./annotation/Annotation";
import type { Attribute } from "./attribute/Attribute";
export declare class Operation {
    readonly name: string;
    readonly attributes: Map<string, Attribute>;
    readonly userResolvedAttributes: Map<string, Attribute>;
    readonly annotations: Partial<Annotations>;
    constructor({ name, attributes, userResolvedAttributes, annotations, }: {
        name: string;
        attributes?: Attribute[];
        userResolvedAttributes?: Attribute[];
        annotations?: Partial<Annotations>;
    });
    findAttribute(name: string): Attribute | undefined;
    findUserResolvedAttributes(name: string): Attribute | undefined;
    private addAttribute;
    private addUserResolvedAttributes;
}
