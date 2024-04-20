import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
/**
 * Returns the concrete entities presents in the where argument,
 * for interface this implicit behavior was substituted by the typename filters therefore we return all the concrete entities,
 * if the where argument is not defined then returns all the concrete entities of the composite target.
 * In case of concrete entities returns the entity itself.
 **/
export declare function getConcreteEntities(target: EntityAdapter, whereArgs?: Record<string, any>): ConcreteEntityAdapter[];
