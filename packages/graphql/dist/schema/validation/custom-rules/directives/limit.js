import { DocumentValidationError } from "../utils/document-validation-error";
import { parseArgumentToInt } from "../utils/utils";
export function verifyLimit({ directiveNode }) {
    const defaultArg = directiveNode.arguments?.find((a) => a.name.value === "default");
    const maxArg = directiveNode.arguments?.find((a) => a.name.value === "max");
    if (!defaultArg && !maxArg) {
        // nothing to check, fields are optional
        return;
    }
    const defaultLimit = parseArgumentToInt(defaultArg);
    const maxLimit = parseArgumentToInt(maxArg);
    if (defaultLimit) {
        const defaultValue = defaultLimit.toNumber();
        // default must be greater than 0
        if (defaultValue <= 0) {
            throw new DocumentValidationError(`@limit.default invalid value: ${defaultValue}. Must be greater than 0.`, ["default"]);
        }
    }
    if (maxLimit) {
        const maxValue = maxLimit.toNumber();
        // max must be greater than 0
        if (maxValue <= 0) {
            throw new DocumentValidationError(`@limit.max invalid value: ${maxValue}. Must be greater than 0.`, [
                "max",
            ]);
        }
    }
    if (defaultLimit && maxLimit) {
        const defaultValue = defaultLimit.toNumber();
        const maxValue = maxLimit.toNumber();
        // default must be smaller than max
        if (maxLimit < defaultLimit) {
            throw new DocumentValidationError(`@limit.max invalid value: ${maxValue}. Must be greater than limit.default: ${defaultValue}.`, ["max"]);
        }
    }
}
