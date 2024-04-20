import type { PrimitiveField, PointField, CustomEnumField, CypherField, CustomScalarField, TemporalField, CustomResolverField } from "../types";
import { GraphElement } from "./GraphElement";
interface RelationshipConstructor {
    name: string;
    type?: string;
    source: string;
    target: string;
    description?: string;
    properties?: string;
    cypherFields?: CypherField[];
    primitiveFields?: PrimitiveField[];
    scalarFields?: CustomScalarField[];
    enumFields?: CustomEnumField[];
    temporalFields?: TemporalField[];
    pointFields?: PointField[];
    customResolverFields?: CustomResolverField[];
}
declare class Relationship extends GraphElement {
    properties?: string;
    source: string;
    target: string;
    constructor(input: RelationshipConstructor);
}
export default Relationship;
