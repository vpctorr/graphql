import { Kind } from "graphql";
import * as neo4j from "neo4j-driver";
import { parseValueNode } from "../../../../schema-model/parser/parse-value-node";
export function getInnerTypeName(typeNode) {
    if (typeNode.kind === Kind.LIST_TYPE) {
        return getInnerTypeName(typeNode.type);
    }
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
        return getInnerTypeName(typeNode.type);
    }
    // Kind.NAMED_TYPE
    return typeNode.name.value;
}
export function fromValueKind(valueNode, enums, expectedType) {
    switch (valueNode.kind) {
        case Kind.STRING:
            return "string";
        case Kind.INT:
            return "int";
        case Kind.FLOAT:
            return "float";
        case Kind.BOOLEAN:
            return "boolean";
        case Kind.ENUM: {
            const enumType = enums?.find((x) => x.name.value === expectedType);
            const enumValue = enumType?.values?.find((value) => value.name.value === valueNode.value);
            if (enumType && enumValue) {
                return enumType.name.value;
            }
            break;
        }
        default:
            // Kind.OBJECT and Kind.VARIABLE remaining
            return;
    }
}
export function getPrettyName(typeNode) {
    if (typeNode.kind === Kind.LIST_TYPE) {
        return `[${getPrettyName(typeNode.type)}]`;
    }
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
        return `${getPrettyName(typeNode.type)}!`;
    }
    // Kind.NAMED_TYPE
    return typeNode.name.value;
}
export function parseArgumentToInt(arg) {
    if (arg) {
        const parsed = parseValueNode(arg.value);
        return neo4j.int(parsed);
    }
    return undefined;
}
export function isArrayType(traversedDef) {
    return (traversedDef.type.kind === Kind.LIST_TYPE ||
        (traversedDef.type.kind === Kind.NON_NULL_TYPE && traversedDef.type.type.kind === Kind.LIST_TYPE));
}
