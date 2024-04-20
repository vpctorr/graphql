import type { CompositeEntity } from "./CompositeEntity";
import type { ConcreteEntity } from "./ConcreteEntity";
export interface Entity {
    readonly name: string;
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
}
