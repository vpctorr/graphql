import type { GraphQLFieldResolver } from "graphql";
import type { Node } from "../../../classes";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { FulltextContext } from "../../../types";
export declare function fulltextResolver({ node, index, entityAdapter, }: {
    node: Node;
    index: FulltextContext;
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
}): GraphQLFieldResolver<any, any, any>;
