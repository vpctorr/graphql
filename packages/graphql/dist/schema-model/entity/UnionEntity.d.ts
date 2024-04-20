import type { ConcreteEntity } from "./ConcreteEntity";
import type { CompositeEntity } from "./CompositeEntity";
import type { Annotations } from "../annotation/Annotation";
export declare class UnionEntity implements CompositeEntity {
    readonly name: string;
    concreteEntities: ConcreteEntity[];
    readonly annotations: Partial<Annotations>;
    constructor({ name, concreteEntities, annotations, }: {
        name: string;
        concreteEntities: ConcreteEntity[];
        annotations?: Partial<Annotations>;
    });
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
}
