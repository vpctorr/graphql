import { Kind } from "graphql";
import { getInnerTypeName } from "../utils/utils";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyTimestamp({ traversedDef, }) {
    if (traversedDef.kind !== Kind.FIELD_DEFINITION) {
        // delegate
        return;
    }
    if (traversedDef.type.kind === Kind.LIST_TYPE) {
        throw new DocumentValidationError("Cannot autogenerate an array.", ["@timestamp"]);
    }
    if (!["DateTime", "Time"].includes(getInnerTypeName(traversedDef.type))) {
        throw new DocumentValidationError("Cannot timestamp Temporal fields lacking time zone information.", [
            "@timestamp",
        ]);
    }
}
