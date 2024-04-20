import type { SchemaComposer } from "graphql-compose";
import type { Node } from "../../classes";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function augmentFulltextSchema(node: Node, composer: SchemaComposer, concreteEntityAdapter: ConcreteEntityAdapter): void;
