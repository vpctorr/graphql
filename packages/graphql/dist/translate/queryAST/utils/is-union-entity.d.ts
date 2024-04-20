import type { EntityAdapter } from "../../../schema-model/entity/EntityAdapter";
import { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isUnionEntity(entity: EntityAdapter | RelationshipAdapter): entity is UnionEntityAdapter;
