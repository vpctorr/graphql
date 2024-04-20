import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { AGGREGATION_COMPARISON_OPERATORS, DEPRECATED } from "../../constants";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import { DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS, DEPRECATE_INVALID_AGGREGATION_FILTERS } from "../constants";
import { numericalResolver } from "../resolvers/field/numerical";
import { graphqlDirectivesToCompose } from "../to-compose";
export function withAggregateSelectionType({ entityAdapter, aggregationTypesMapper, propagatedDirectives, composer, }) {
    const aggregateSelection = composer.createObjectTC({
        name: entityAdapter.operations.aggregateTypeNames.selection,
        fields: {
            count: {
                type: new GraphQLNonNull(GraphQLInt),
                resolve: numericalResolver,
                args: {},
            },
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
    aggregateSelection.addFields(makeAggregableFields({ entityAdapter, aggregationTypesMapper }));
    return aggregateSelection;
}
function makeAggregableFields({ entityAdapter, aggregationTypesMapper, }) {
    const aggregableFields = {};
    const aggregableAttributes = entityAdapter.aggregableFields;
    for (const attribute of aggregableAttributes) {
        const objectTypeComposer = aggregationTypesMapper.getAggregationType(attribute.getTypeName());
        if (objectTypeComposer) {
            aggregableFields[attribute.name] = objectTypeComposer.NonNull;
        }
    }
    return aggregableFields;
}
export function withAggregateInputType({ relationshipAdapter, entityAdapter, // TODO: this is relationshipAdapter.target but from the context above it is known to be ConcreteEntity and we don't know this yet!!!
composer, userDefinedDirectivesOnTargetFields, }) {
    const aggregateInputTypeName = relationshipAdapter.operations.aggregateInputTypeName;
    if (composer.has(aggregateInputTypeName)) {
        return composer.getITC(aggregateInputTypeName);
    }
    const aggregateSelection = composer.createInputTC({
        name: aggregateInputTypeName,
        fields: {
            count: GraphQLInt,
            count_LT: GraphQLInt,
            count_LTE: GraphQLInt,
            count_GT: GraphQLInt,
            count_GTE: GraphQLInt,
        },
    });
    aggregateSelection.addFields({
        AND: aggregateSelection.NonNull.List,
        OR: aggregateSelection.NonNull.List,
        NOT: aggregateSelection,
    });
    const nodeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter,
        composer,
        userDefinedDirectivesOnTargetFields,
    });
    if (nodeWhereInputType) {
        aggregateSelection.addFields({ node: nodeWhereInputType });
    }
    const edgeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter: relationshipAdapter,
        composer,
        userDefinedDirectivesOnTargetFields,
    });
    if (edgeWhereInputType) {
        aggregateSelection.addFields({ edge: edgeWhereInputType });
    }
    return aggregateSelection;
}
function withAggregationWhereInputType({ relationshipAdapter, entityAdapter, composer, userDefinedDirectivesOnTargetFields, }) {
    const aggregationInputName = entityAdapter instanceof ConcreteEntityAdapter || entityAdapter instanceof InterfaceEntityAdapter
        ? relationshipAdapter.operations.nodeAggregationWhereInputTypeName
        : relationshipAdapter.operations.edgeAggregationWhereInputTypeName;
    if (composer.has(aggregationInputName)) {
        return composer.getITC(aggregationInputName);
    }
    if (entityAdapter instanceof RelationshipDeclarationAdapter) {
        return;
    }
    const aggregationFields = entityAdapter.aggregationWhereFields;
    if (!aggregationFields.length) {
        return;
    }
    const aggregationInput = composer.createInputTC({
        name: aggregationInputName,
        fields: {},
    });
    aggregationInput.addFields({
        AND: aggregationInput.NonNull.List,
        OR: aggregationInput.NonNull.List,
        NOT: aggregationInput,
    });
    aggregationInput.addFields(makeAggregationFields(aggregationFields, userDefinedDirectivesOnTargetFields));
    return aggregationInput;
}
function makeAggregationFields(attributes, userDefinedDirectivesOnTargetFields) {
    const aggregationFields = attributes
        .map((attribute) => getAggregationFieldsByType(attribute, userDefinedDirectivesOnTargetFields?.get(attribute.name)))
        .reduce((acc, el) => ({ ...acc, ...el }), {});
    return aggregationFields;
}
// TODO: refactor this by introducing specialized Adapters
function getAggregationFieldsByType(attribute, directivesOnField) {
    const fields = {};
    const deprecatedDirectives = graphqlDirectivesToCompose((directivesOnField || []).filter((d) => d.name.value === DEPRECATED));
    if (attribute.typeHelper.isID()) {
        fields[`${attribute.name}_EQUAL`] = {
            type: GraphQLID,
            directives: [DEPRECATE_INVALID_AGGREGATION_FILTERS],
        };
        return fields;
    }
    if (attribute.typeHelper.isString()) {
        for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_${operator}`] = {
                type: `${operator === "EQUAL" ? GraphQLString : GraphQLInt}`,
                directives: [DEPRECATE_INVALID_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_AVERAGE_${operator}`] = {
                type: GraphQLFloat,
                directives: [DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_LONGEST_${operator}`] = {
                type: GraphQLInt,
                directives: [DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_SHORTEST_${operator}`] = {
                type: GraphQLInt,
                directives: [DEPRECATE_IMPLICIT_LENGTH_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_AVERAGE_LENGTH_${operator}`] = {
                type: GraphQLFloat,
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_LONGEST_LENGTH_${operator}`] = {
                type: GraphQLInt,
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_SHORTEST_LENGTH_${operator}`] = {
                type: GraphQLInt,
                directives: deprecatedDirectives,
            };
        }
        return fields;
    }
    if (attribute.typeHelper.isNumeric() || attribute.typeHelper.isDuration()) {
        // Types that you can average
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg-duration
        // String uses avg(size())
        for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_${operator}`] = {
                type: attribute.getTypeName(),
                directives: [DEPRECATE_INVALID_AGGREGATION_FILTERS],
            };
            fields[`${attribute.name}_MIN_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_MAX_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives,
            };
            if (attribute.getTypeName() !== "Duration") {
                fields[`${attribute.name}_SUM_${operator}`] = {
                    type: attribute.getTypeName(),
                    directives: deprecatedDirectives,
                };
            }
            const averageType = attribute.typeHelper.isBigInt()
                ? "BigInt"
                : attribute.typeHelper.isDuration()
                    ? "Duration"
                    : GraphQLFloat;
            fields[`${attribute.name}_AVERAGE_${operator}`] = { type: averageType, directives: deprecatedDirectives };
        }
        return fields;
    }
    for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
        fields[`${attribute.name}_${operator}`] = {
            type: attribute.getTypeName(),
            directives: [DEPRECATE_INVALID_AGGREGATION_FILTERS],
        };
        fields[`${attribute.name}_MIN_${operator}`] = {
            type: attribute.getTypeName(),
            directives: deprecatedDirectives,
        };
        fields[`${attribute.name}_MAX_${operator}`] = {
            type: attribute.getTypeName(),
            directives: deprecatedDirectives,
        };
    }
    return fields;
}
