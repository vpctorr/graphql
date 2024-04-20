import type { InputTypeComposer, ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
export declare function withFullTextInputType({ concreteEntityAdapter, composer, }: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    composer: SchemaComposer;
}): InputTypeComposer | undefined;
export declare function withFullTextWhereInputType({ composer, concreteEntityAdapter, }: {
    composer: SchemaComposer;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): InputTypeComposer;
export declare function withFullTextSortInputType({ composer, concreteEntityAdapter, }: {
    composer: SchemaComposer;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): InputTypeComposer;
export declare function withFullTextResultType({ composer, concreteEntityAdapter, }: {
    composer: SchemaComposer;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): ObjectTypeComposer;
