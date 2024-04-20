import { Kind } from "graphql";
import { assertArgumentHasSameTypeAsField } from "../utils/same-type-argument-as-field";
import { getInnerTypeName, isArrayType } from "../utils/utils";
import { GRAPHQL_BUILTIN_SCALAR_TYPES, isSpatial, isTemporal } from "../../../../constants";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyCoalesce(enums) {
    return function ({ directiveNode, traversedDef, }) {
        if (traversedDef.kind !== Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        const coalesceArg = directiveNode.arguments?.find((a) => a.name.value === "value");
        const expectedType = getInnerTypeName(traversedDef.type);
        if (!coalesceArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (!isArrayType(traversedDef)) {
            if (isSpatial(expectedType)) {
                throw new DocumentValidationError(`@coalesce is not supported by Spatial types.`, ["value"]);
            }
            if (isTemporal(expectedType)) {
                throw new DocumentValidationError(`@coalesce is not supported by Temporal types.`, ["value"]);
            }
            if (!GRAPHQL_BUILTIN_SCALAR_TYPES.includes(expectedType) &&
                !enums.find((x) => x.name.value === expectedType)) {
                throw new DocumentValidationError(`@coalesce directive can only be used on types: Int | Float | String | Boolean | ID | Enum`, []);
            }
        }
        assertArgumentHasSameTypeAsField({ directiveName: "@coalesce", traversedDef, argument: coalesceArg, enums });
    };
}
