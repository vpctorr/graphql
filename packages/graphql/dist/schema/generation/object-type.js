import { GraphQLID, GraphQLNonNull } from "graphql";
import { InterfaceEntity } from "../../schema-model/entity/InterfaceEntity";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { attributeAdapterToComposeFields, graphqlDirectivesToCompose } from "../to-compose";
export function getRelationshipPropertiesTypeDescription({ relationshipAdapter, propertiesObjectType, }) {
    if (propertiesObjectType) {
        return [
            propertiesObjectType.getDescription(),
            `* ${relationshipAdapter.source.name}.${relationshipAdapter.name}`,
        ].join("\n");
    }
    return `The edge properties for the following fields:\n* ${relationshipAdapter.source.name}.${relationshipAdapter.name}`;
}
export function withObjectType({ entityAdapter, userDefinedFieldDirectives, userDefinedObjectDirectives, composer, }) {
    if (entityAdapter instanceof RelationshipAdapter) {
        // @relationshipProperties
        const objectComposeFields = attributeAdapterToComposeFields(Array.from(entityAdapter.attributes.values()), userDefinedFieldDirectives);
        const composeObject = composer.createObjectTC({
            name: entityAdapter.propertiesTypeName,
            fields: objectComposeFields,
            directives: graphqlDirectivesToCompose(userDefinedObjectDirectives),
            description: getRelationshipPropertiesTypeDescription({ relationshipAdapter: entityAdapter }),
        });
        return composeObject;
    }
    const nodeFields = attributeAdapterToComposeFields(entityAdapter.objectFields, userDefinedFieldDirectives);
    const composeNode = composer.createObjectTC({
        name: entityAdapter.name,
        fields: nodeFields,
        description: entityAdapter.description,
        directives: graphqlDirectivesToCompose(userDefinedObjectDirectives),
        interfaces: entityAdapter.compositeEntities.filter((e) => e instanceof InterfaceEntity).map((e) => e.name),
    });
    // TODO: maybe split this global node logic?
    if (entityAdapter.isGlobalNode()) {
        composeNode.setField("id", {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (src) => {
                const field = entityAdapter.globalIdField.name;
                const value = src[field];
                return entityAdapter.toGlobalId(value.toString());
            },
        });
        composeNode.addInterface("Node");
    }
    return composeNode;
}
