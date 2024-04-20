import type { CypherField, PrimitiveField, CustomEnumField, CustomScalarField, TemporalField, PointField, CustomResolverField, BaseField } from "../types";
export interface GraphElementConstructor {
    name: string;
    description?: string;
    cypherFields: CypherField[];
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
    customResolverFields: CustomResolverField[];
}
export declare abstract class GraphElement {
    name: string;
    description?: string;
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
    customResolverFields: CustomResolverField[];
    constructor(input: GraphElementConstructor);
    getField(name: string): BaseField | undefined;
    private getAllFields;
    private searchFieldInList;
}
