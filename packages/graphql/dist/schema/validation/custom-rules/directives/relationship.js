import { Kind } from "graphql";
import { parseValueNode } from "../../../../schema-model/parser/parse-value-node";
import { DocumentValidationError } from "../utils/document-validation-error";
import { getInheritedTypeNames, hydrateInterfaceWithImplementedTypesMap, } from "../utils/interface-to-implementing-types";
import { getPrettyName } from "../utils/utils";
export function verifyRelationshipArgumentValue(objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap, extra) {
    return function ({ directiveNode, traversedDef, parentDef, }) {
        if (traversedDef.kind !== Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        if (!parentDef) {
            console.error("No parent definition");
            return;
        }
        const typeArg = directiveNode.arguments?.find((a) => a.name.value === "type");
        const directionArg = directiveNode.arguments?.find((a) => a.name.value === "direction");
        const propertiesArg = directiveNode.arguments?.find((a) => a.name.value === "properties");
        if (!typeArg && !directionArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (typeArg && directionArg) {
            const fieldType = getPrettyName(traversedDef.type);
            const typeValue = parseValueNode(typeArg.value);
            const directionValue = parseValueNode(directionArg.value);
            const currentRelationship = [traversedDef.name.value, directionValue, fieldType];
            verifyRelationshipFields(parentDef, currentRelationship, typeValue, objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap);
        }
        if (propertiesArg) {
            const propertiesValue = parseValueNode(propertiesArg.value);
            if (!extra) {
                throw new Error("Missing data: Enums, Interfaces, Unions.");
            }
            const relationshipPropertiesInterface = extra.interfaces.filter((i) => i.name.value.toLowerCase() === propertiesValue.toLowerCase() &&
                i.kind === Kind.INTERFACE_TYPE_DEFINITION);
            if (relationshipPropertiesInterface.length > 0) {
                throw new DocumentValidationError(`@relationship.properties invalid. The @relationshipProperties directive must be applied to a type and not an interface, a breaking change introduced in version 5.0.0.`, ["properties"]);
            }
            const relationshipPropertiesType = extra.objects.filter((i) => i.name.value.toLowerCase() === propertiesValue.toLowerCase() &&
                i.kind === Kind.OBJECT_TYPE_DEFINITION);
            if (relationshipPropertiesType.length > 1) {
                throw new DocumentValidationError(`@relationship.properties invalid. Cannot have more than 1 type represent the relationship properties.`, ["properties"]);
            }
            if (!relationshipPropertiesType.length) {
                throw new DocumentValidationError(`@relationship.properties invalid. Cannot find type to represent the relationship properties: ${propertiesValue}.`, ["properties"]);
            }
            const isRelationshipPropertiesTypeAnnotated = relationshipPropertiesType[0]?.directives?.some((d) => d.name.value === "relationshipProperties");
            if (!isRelationshipPropertiesTypeAnnotated) {
                throw new DocumentValidationError(`@relationship.properties invalid. Properties type ${propertiesValue} must use directive \`@relationshipProperties\`.`, ["properties"]);
            }
        }
    };
}
function getUpdatedRelationshipFieldsForCurrentType(relationshipFieldsForCurrentType, currentRelationship, typeValue) {
    const updatedRelationshipFieldsForCurrentType = relationshipFieldsForCurrentType || new Map();
    const updatedRelationshipsWithSameRelationshipType = (relationshipFieldsForCurrentType?.get(typeValue) || []).concat([currentRelationship]);
    updatedRelationshipFieldsForCurrentType.set(typeValue, updatedRelationshipsWithSameRelationshipType);
    return updatedRelationshipFieldsForCurrentType;
}
function checkRelationshipFieldsForDuplicates(relationshipFieldsForDependentType, currentRelationship, typeValue) {
    if (!relationshipFieldsForDependentType) {
        return;
    }
    const relationshipsWithSameRelationshipType = relationshipFieldsForDependentType.get(typeValue);
    relationshipsWithSameRelationshipType?.forEach(([fieldName, existingDirection, existingFieldType]) => {
        if (fieldName !== currentRelationship[0] &&
            existingDirection === currentRelationship[1] &&
            existingFieldType === currentRelationship[2]) {
            throw new DocumentValidationError(`@relationship invalid. Multiple fields of the same type cannot have a relationship with the same direction and type combination.`, []);
        }
    });
}
function verifyRelationshipFields(parentDef, currentRelationship, typeValue, objectTypeToRelationshipsPerRelationshipTypeMap, interfaceToImplementationsMap) {
    const relationshipFieldsForCurrentType = objectTypeToRelationshipsPerRelationshipTypeMap.get(parentDef.name.value);
    checkRelationshipFieldsForDuplicates(relationshipFieldsForCurrentType, currentRelationship, typeValue);
    objectTypeToRelationshipsPerRelationshipTypeMap.set(parentDef.name.value, getUpdatedRelationshipFieldsForCurrentType(relationshipFieldsForCurrentType, currentRelationship, typeValue));
    const inheritedTypeNames = getInheritedTypeNames(parentDef, interfaceToImplementationsMap);
    inheritedTypeNames.forEach((typeName) => {
        const inheritedRelationshipFields = objectTypeToRelationshipsPerRelationshipTypeMap.get(typeName);
        checkRelationshipFieldsForDuplicates(inheritedRelationshipFields, currentRelationship, typeValue);
    });
    hydrateInterfaceWithImplementedTypesMap(parentDef, interfaceToImplementationsMap);
}
