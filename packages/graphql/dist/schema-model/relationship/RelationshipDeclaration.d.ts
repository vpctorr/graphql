import type { RelationshipNestedOperationsOption } from "../../constants";
import type { Annotations } from "../annotation/Annotation";
import type { Argument } from "../argument/Argument";
import type { Entity } from "../entity/Entity";
import type { Relationship } from "./Relationship";
export type NestedOperation = keyof typeof RelationshipNestedOperationsOption;
export declare class RelationshipDeclaration {
    readonly name: string;
    readonly args: Argument[];
    readonly source: Entity;
    readonly target: Entity;
    readonly isList: boolean;
    readonly nestedOperations: NestedOperation[];
    readonly aggregate: boolean;
    readonly isNullable: boolean;
    readonly description?: string;
    readonly annotations: Partial<Annotations>;
    readonly relationshipImplementations: Relationship[];
    readonly firstDeclaredInTypeName: string | undefined;
    constructor({ name, args, source, target, isList, nestedOperations, aggregate, isNullable, description, annotations, relationshipImplementations, firstDeclaredInTypeName, }: {
        name: string;
        args: Argument[];
        source: Entity;
        target: Entity;
        isList: boolean;
        nestedOperations: NestedOperation[];
        aggregate: boolean;
        isNullable: boolean;
        description?: string;
        annotations?: Partial<Annotations>;
        relationshipImplementations: Relationship[];
        firstDeclaredInTypeName?: string;
    });
    clone(): RelationshipDeclaration;
}
