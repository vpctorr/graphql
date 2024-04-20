import type { DirectiveNode } from "graphql";
import type { Directive } from "graphql-compose";
import type { AttributeAdapter } from "../schema-model/attribute/model-adapters/AttributeAdapter";
import type { CustomEnumField, CustomScalarField, Neo4jFeaturesSettings, PointField, PrimitiveField, TemporalField } from "../types";
interface Fields {
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    primitiveFields: PrimitiveField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
}
declare function getWhereFields({ typeName, fields, isInterface, features, }: {
    typeName: string;
    fields: Fields;
    isInterface?: boolean;
    features?: Neo4jFeaturesSettings;
}): {
    OR?: string | undefined;
    AND?: string | undefined;
    NOT?: string | undefined;
};
export default getWhereFields;
export declare function getWhereFieldsForAttributes({ attributes, userDefinedFieldDirectives, features, }: {
    attributes: AttributeAdapter[];
    userDefinedFieldDirectives?: Map<string, DirectiveNode[]>;
    features?: Neo4jFeaturesSettings;
}): Record<string, {
    type: string;
    directives: Directive[];
}>;
