import type { ConcreteEntity } from "./ConcreteEntity";
import type { Entity } from "./Entity";
/** models the concept of an Abstract Type */
export interface CompositeEntity extends Entity {
    readonly name: string;
    concreteEntities: ConcreteEntity[];
}
