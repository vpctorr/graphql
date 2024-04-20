import type { DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, SchemaComposer } from "graphql-compose";
import type { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
export declare function withInterfaceType({ interfaceEntityAdapter, userDefinedFieldDirectives, userDefinedInterfaceDirectives, composer, }: {
    interfaceEntityAdapter: InterfaceEntityAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    userDefinedInterfaceDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): InterfaceTypeComposer;
