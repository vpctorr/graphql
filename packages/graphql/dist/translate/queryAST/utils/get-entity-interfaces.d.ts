import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
/**
 *  Return all the interfaces the provided concrete entity inherits
 *  Note that this functions accepts and returns Adapters, not the raw entities
 */
export declare function getEntityInterfaces(entity: ConcreteEntityAdapter): InterfaceEntityAdapter[];
