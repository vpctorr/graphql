import { parseValueNode } from "../../../../schema-model/parser/parse-value-node";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyPopulatedBy(callbacks) {
    return function ({ directiveNode }) {
        const callbackArg = directiveNode.arguments?.find((x) => x.name.value === "callback");
        if (!callbackArg) {
            // delegate to DirectiveArgumentOfCorrectType rule
            return;
        }
        const callbackName = parseValueNode(callbackArg.value);
        if (!callbacks) {
            throw new DocumentValidationError(`@populatedBy.callback needs to be provided in features option.`, [
                "callback",
            ]);
        }
        if (typeof (callbacks || {})[callbackName] !== "function") {
            throw new DocumentValidationError(`@populatedBy.callback \`${callbackName}\` must be of type Function.`, [
                "callback",
            ]);
        }
    };
}
