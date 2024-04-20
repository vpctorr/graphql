import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isRelationshipEntity(entity: EntityAdapter | RelationshipAdapter): entity is RelationshipAdapter;
