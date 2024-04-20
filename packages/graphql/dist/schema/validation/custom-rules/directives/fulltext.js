import { Kind } from "graphql";
import { parseValueNode } from "../../../../schema-model/parser/parse-value-node";
import { DocumentValidationError } from "../utils/document-validation-error";
export function verifyFulltext({ directiveNode, traversedDef, }) {
    if (traversedDef.kind !== Kind.OBJECT_TYPE_DEFINITION && traversedDef.kind !== Kind.OBJECT_TYPE_EXTENSION) {
        // delegate
        return;
    }
    const indexesArg = directiveNode.arguments?.find((a) => a.name.value === "indexes");
    if (!indexesArg) {
        // delegate to DirectiveArgumentOfCorrectType rule
        return;
    }
    const indexesValue = parseValueNode(indexesArg.value);
    const compatibleFields = traversedDef.fields?.filter((f) => {
        if (f.type.kind === Kind.NON_NULL_TYPE) {
            const innerType = f.type.type;
            if (innerType.kind === Kind.NAMED_TYPE) {
                return ["String", "ID"].includes(innerType.name.value);
            }
        }
        if (f.type.kind === Kind.NAMED_TYPE) {
            return ["String", "ID"].includes(f.type.name.value);
        }
        return false;
    });
    indexesValue.forEach((index) => {
        const indexName = index.indexName || index.name;
        const names = indexesValue.filter((i) => indexName === (i.indexName || i.name));
        if (names.length > 1) {
            throw new DocumentValidationError(`@fulltext.indexes invalid value for: ${indexName}. Duplicate name.`, [
                "indexes",
            ]);
        }
        (index.fields || []).forEach((field) => {
            const foundField = compatibleFields?.some((f) => f.name.value === field);
            if (!foundField) {
                throw new DocumentValidationError(`@fulltext.indexes invalid value for: ${indexName}. Field ${field} is not of type String or ID.`, ["indexes"]);
            }
        });
    });
}
