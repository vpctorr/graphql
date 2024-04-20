import type { Annotations } from "../annotation/Annotation";
import type { Attribute } from "../attribute/Attribute";
import type { RelationshipDeclaration } from "../relationship/RelationshipDeclaration";
import type { CompositeEntity } from "./CompositeEntity";
import type { ConcreteEntity } from "./ConcreteEntity";
export declare class InterfaceEntity implements CompositeEntity {
    readonly name: string;
    readonly description?: string;
    readonly concreteEntities: ConcreteEntity[];
    readonly attributes: Map<string, Attribute>;
    readonly relationshipDeclarations: Map<string, RelationshipDeclaration>;
    readonly annotations: Partial<Annotations>;
    constructor({ name, description, concreteEntities, attributes, annotations, relationshipDeclarations, }: {
        name: string;
        description?: string;
        concreteEntities: ConcreteEntity[];
        attributes?: Attribute[];
        annotations?: Partial<Annotations>;
        relationshipDeclarations?: RelationshipDeclaration[];
    });
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
    private addAttribute;
    addRelationshipDeclaration(relationshipDeclaration: RelationshipDeclaration): void;
    findAttribute(name: string): Attribute | undefined;
}
