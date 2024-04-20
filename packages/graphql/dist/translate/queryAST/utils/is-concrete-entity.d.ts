import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isConcreteEntity(entity: EntityAdapter | RelationshipAdapter): entity is ConcreteEntityAdapter;
export declare function assertIsConcreteEntity(entity?: EntityAdapter | RelationshipAdapter): asserts entity is ConcreteEntityAdapter;
