function getEdgeWrapperTypeDescription({ inputType, relationshipAdapter, }) {
    const initialDescription = `Relationship properties when source node is of type:`;
    const entryInDescription = `* ${relationshipAdapter.source.name}`;
    return [
        inputType.hasField(relationshipAdapter.propertiesTypeName)
            ? inputType.getField(relationshipAdapter.propertiesTypeName).description
            : initialDescription,
        entryInDescription,
    ].join("\n");
}
export function withEdgeWrapperType({ edgeTypeName, edgeFieldTypeName, edgeFieldAdapter, composer, }) {
    if (!edgeFieldAdapter.propertiesTypeName) {
        return;
    }
    const inputType = composer.getOrCreateITC(edgeTypeName);
    inputType.addFields({
        [edgeFieldAdapter.propertiesTypeName]: {
            type: edgeFieldTypeName,
            description: getEdgeWrapperTypeDescription({ inputType, relationshipAdapter: edgeFieldAdapter }),
        },
    });
    return inputType;
}
