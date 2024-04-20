import type { SchemaComposer } from "graphql-compose";
import type { Node } from "../types";
import type { ConcreteEntity } from "../schema-model/entity/ConcreteEntity";
export declare function addGlobalNodeFields(nodes: Node[], composer: SchemaComposer, concreteEntities: ConcreteEntity[]): boolean;
