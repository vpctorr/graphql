import { Kind } from "graphql";
import { assertArgumentHasSameTypeAsField } from "../utils/same-type-argument-as-field";
import { getInnerTypeName, isArrayType } from "../utils/utils";
import { DocumentValidationError } from "../utils/document-validation-error";
import { GRAPHQL_BUILTIN_SCALAR_TYPES, isSpatial, isTemporal } from "../../../../constants";
// TODO: schema-generation: save enums as map
export function verifyDefault(enums) {
    return function ({ directiveNode, traversedDef, }) {
        if (traversedDef.kind !== Kind.FIELD_DEFINITION) {
            // delegate
            return;
        }
        const defaultArg = directiveNode.arguments?.find((a) => a.name.value === "value");
        const expectedType = getInnerTypeName(traversedDef.type);
        if (!defaultArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        if (!isArrayType(traversedDef)) {
            if (isSpatial(expectedType)) {
                throw new DocumentValidationError(`@default is not supported by Spatial types.`, ["value"]);
            }
            else if (isTemporal(expectedType)) {
                if (Number.isNaN(Date.parse((defaultArg?.value).value))) {
                    throw new DocumentValidationError(`@default.${defaultArg.name.value} is not a valid ${expectedType}`, ["value"]);
                }
            }
            else if (!GRAPHQL_BUILTIN_SCALAR_TYPES.includes(expectedType) &&
                !enums.some((x) => x.name.value === expectedType)) {
                throw new DocumentValidationError(`@default directive can only be used on Temporal types and types: Int | Float | String | Boolean | ID | Enum`, []);
            }
        }
        assertArgumentHasSameTypeAsField({ directiveName: "@default", traversedDef, argument: defaultArg, enums });
    };
}
