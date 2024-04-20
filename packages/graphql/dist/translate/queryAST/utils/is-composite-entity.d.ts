import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isCompositeEntity(entity: EntityAdapter | RelationshipAdapter): entity is InterfaceEntityAdapter | UnionEntityAdapter;
