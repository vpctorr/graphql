import { attributeAdapterToComposeFields, graphqlDirectivesToCompose } from "../to-compose";
export function withInterfaceType({ interfaceEntityAdapter, userDefinedFieldDirectives, userDefinedInterfaceDirectives, composer, }) {
    // TODO: maybe create interfaceEntity.interfaceFields() method abstraction even if it retrieves all attributes?
    // can also take includeRelationships as argument
    const objectComposeFields = attributeAdapterToComposeFields(Array.from(interfaceEntityAdapter.attributes.values()), userDefinedFieldDirectives);
    const interfaceTypeName = interfaceEntityAdapter.name;
    return composer.createInterfaceTC({
        name: interfaceTypeName,
        fields: objectComposeFields,
        directives: graphqlDirectivesToCompose(userDefinedInterfaceDirectives),
    });
}
