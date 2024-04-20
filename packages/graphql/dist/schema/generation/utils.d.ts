import type { RelationshipNestedOperationsOption } from "../../constants";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export declare function relationshipTargetHasRelationshipWithNestedOperation(target: ConcreteEntityAdapter | InterfaceEntityAdapter, nestedOperation: RelationshipNestedOperationsOption): boolean;
