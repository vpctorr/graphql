import { Kind } from "graphql";
import { parseValueNode } from "../../../../schema-model/parser/parse-value-node";
import { getInnerTypeName } from "../utils/utils";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyId({ directiveNode, traversedDef, }) {
    if (traversedDef.kind !== Kind.FIELD_DEFINITION) {
        // delegate
        return;
    }
    const autogenerateArg = directiveNode.arguments?.find((x) => x.name.value === "autogenerate");
    if (autogenerateArg) {
        const autogenerate = parseValueNode(autogenerateArg.value);
        if (!autogenerate) {
            return;
        }
    }
    if (traversedDef.type.kind === Kind.LIST_TYPE) {
        throw new DocumentValidationError("Cannot autogenerate an array.", ["@id"]);
    }
    if (getInnerTypeName(traversedDef.type) !== "ID") {
        throw new DocumentValidationError("Cannot autogenerate a non ID field.", ["@id"]);
    }
}
