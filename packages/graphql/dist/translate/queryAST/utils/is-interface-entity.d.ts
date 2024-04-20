import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isInterfaceEntity(entity: EntityAdapter | RelationshipAdapter): entity is InterfaceEntityAdapter;
