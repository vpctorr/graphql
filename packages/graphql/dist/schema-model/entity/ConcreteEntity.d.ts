import type { Annotations } from "../annotation/Annotation";
import type { Attribute } from "../attribute/Attribute";
import type { Relationship } from "../relationship/Relationship";
import type { CompositeEntity } from "./CompositeEntity";
import type { Entity } from "./Entity";
export declare class ConcreteEntity implements Entity {
    readonly name: string;
    readonly description?: string;
    readonly labels: Set<string>;
    readonly attributes: Map<string, Attribute>;
    readonly relationships: Map<string, Relationship>;
    readonly annotations: Partial<Annotations>;
    readonly compositeEntities: CompositeEntity[];
    constructor({ name, description, labels, attributes, annotations, relationships, compositeEntities, }: {
        name: string;
        labels: string[];
        attributes?: Attribute[];
        annotations?: Partial<Annotations>;
        relationships?: Relationship[];
        description?: string;
        compositeEntities?: CompositeEntity[];
    });
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
    matchLabels(labels: string[]): boolean;
    private addAttribute;
    addRelationship(relationship: Relationship): void;
    addCompositeEntities(entity: CompositeEntity): void;
    findAttribute(name: string): Attribute | undefined;
    findRelationship(name: string): Relationship | undefined;
}
