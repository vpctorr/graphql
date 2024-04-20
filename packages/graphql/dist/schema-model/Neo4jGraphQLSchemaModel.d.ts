import type { Operation } from "./Operation";
import type { Annotations } from "./annotation/Annotation";
import type { CompositeEntity } from "./entity/CompositeEntity";
import type { ConcreteEntity } from "./entity/ConcreteEntity";
import type { Entity } from "./entity/Entity";
import { ConcreteEntityAdapter } from "./entity/model-adapters/ConcreteEntityAdapter";
export type Operations = {
    Query?: Operation;
    Mutation?: Operation;
    Subscription?: Operation;
};
/** Represents the internal model for the Neo4jGraphQL schema */
export declare class Neo4jGraphQLSchemaModel {
    entities: Map<string, Entity>;
    concreteEntities: ConcreteEntity[];
    compositeEntities: CompositeEntity[];
    operations: Operations;
    readonly annotations: Partial<Annotations>;
    constructor({ concreteEntities, compositeEntities, operations, annotations, }: {
        concreteEntities: ConcreteEntity[];
        compositeEntities: CompositeEntity[];
        operations: Operations;
        annotations?: Partial<Annotations>;
    });
    getEntity(name: string): Entity | undefined;
    getConcreteEntityAdapter(name: string): ConcreteEntityAdapter | undefined;
    getEntitiesByLabels(labels: string[]): ConcreteEntity[];
    getEntitiesByNameAndLabels(name: string, labels: string[]): ConcreteEntity[];
}
