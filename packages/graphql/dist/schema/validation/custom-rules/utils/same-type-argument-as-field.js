import { Kind } from "graphql";
import { fromValueKind, getInnerTypeName, isArrayType } from "./utils";
import { isSpatial, isTemporal } from "../../../../constants";
import { DocumentValidationError } from "./document-validation-error";
export function assertArgumentHasSameTypeAsField({ directiveName, traversedDef, argument, enums, }) {
    const expectedType = getInnerTypeName(traversedDef.type);
    if (isArrayType(traversedDef)) {
        if (argument.value.kind !== Kind.LIST) {
            throw new DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} list fields must be a list of ${expectedType} values`, [argument.name.value]);
        }
        argument.value.values.forEach((v) => {
            if (!v) {
                // delegate to DirectiveArgumentOfCorrectType rule
                return;
            }
            if (!doTypesMatch(expectedType, v, enums)) {
                throw new DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} list fields must be a list of ${expectedType} values`, [argument.name.value]);
            }
        });
    }
    else {
        if (!doTypesMatch(expectedType, argument.value, enums)) {
            throw new DocumentValidationError(`${directiveName}.${argument.name.value} on ${expectedType} fields must be of type ${expectedType}`, [argument.name.value]);
        }
    }
}
function doTypesMatch(expectedType, argumentValueType, enums) {
    const isSpatialOrTemporal = isSpatial(expectedType) || isTemporal(expectedType);
    if (isSpatialOrTemporal) {
        return true;
    }
    if (expectedType.toLowerCase() === "id") {
        return !!(fromValueKind(argumentValueType, enums, expectedType)?.toLowerCase() === "string");
    }
    return fromValueKind(argumentValueType, enums, expectedType)?.toLowerCase() === expectedType.toLowerCase();
}
