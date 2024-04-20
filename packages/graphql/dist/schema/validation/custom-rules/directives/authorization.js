import { AuthorizationAnnotationArguments } from "../../../../schema-model/annotation/AuthorizationAnnotation";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyAuthorization() {
    return function ({ directiveNode }) {
        for (const arg of AuthorizationAnnotationArguments) {
            if (directiveNode.arguments?.find((a) => a.name.value === arg)) {
                return;
            }
        }
        throw new DocumentValidationError(`@authorization requires at least one of ${AuthorizationAnnotationArguments.join(", ")} arguments`, []);
    };
}
