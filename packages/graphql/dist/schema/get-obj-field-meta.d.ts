import type { IResolvers } from "@graphql-tools/utils";
import type { EnumTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, UnionTypeDefinitionNode } from "graphql";
import type { RelationField, CypherField, PrimitiveField, CustomEnumField, CustomScalarField, UnionField, InterfaceField, ObjectField, TemporalField, PointField, ConnectionField, CustomResolverField, Neo4jGraphQLCallbacks } from "../types";
export interface ObjectFields {
    relationFields: RelationField[];
    connectionFields: ConnectionField[];
    primitiveFields: PrimitiveField[];
    cypherFields: CypherField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    objectFields: ObjectField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
    customResolverFields: CustomResolverField[];
}
declare function getObjFieldMeta({ obj, objects, interfaces, scalars, unions, enums, callbacks, customResolvers, }: {
    obj: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
    objects: ObjectTypeDefinitionNode[];
    interfaces: InterfaceTypeDefinitionNode[];
    unions: UnionTypeDefinitionNode[];
    scalars: ScalarTypeDefinitionNode[];
    enums: EnumTypeDefinitionNode[];
    callbacks?: Neo4jGraphQLCallbacks;
    customResolvers?: IResolvers | Array<IResolvers>;
}): ObjectFields;
export default getObjFieldMeta;