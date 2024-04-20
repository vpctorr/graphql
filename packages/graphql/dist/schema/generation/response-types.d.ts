import type { DirectiveNode } from "graphql";
import type { SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function withMutationResponseTypes({ concreteEntityAdapter, propagatedDirectives, composer, }: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    propagatedDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): void;
