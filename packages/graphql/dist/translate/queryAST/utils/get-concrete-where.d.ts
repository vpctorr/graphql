import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
export declare function getConcreteWhere(compositeTarget: UnionEntityAdapter | InterfaceEntityAdapter, concreteTarget: ConcreteEntityAdapter, whereArgs?: Record<string, any>): Record<string, any>;
