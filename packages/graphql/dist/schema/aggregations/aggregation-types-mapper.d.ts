import type { ObjectTypeComposer, SchemaComposer } from "graphql-compose";
import type { Subgraph } from "../../classes/Subgraph";
export declare class AggregationTypesMapper {
    private readonly aggregationSelectionTypes;
    private readonly subgraph;
    constructor(composer: SchemaComposer, subgraph?: Subgraph);
    getAggregationType(typeName: string): ObjectTypeComposer<unknown, unknown> | undefined;
    private getOrCreateAggregationSelectionTypes;
    private createType;
}
