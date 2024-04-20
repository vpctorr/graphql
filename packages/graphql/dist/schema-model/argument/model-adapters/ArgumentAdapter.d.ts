import type { AttributeType } from "../../attribute/AttributeType";
import { ListType } from "../../attribute/AttributeType";
import type { Argument } from "../Argument";
export declare class ArgumentAdapter {
    name: string;
    type: AttributeType;
    description?: string;
    defaultValue?: string;
    private assertionOptions;
    constructor(argument: Argument);
    /**
     * Just a helper to get the wrapped type in case of a list, useful for the assertions
     */
    private getTypeForAssertion;
    isBoolean(options?: {
        includeLists: boolean;
    }): boolean;
    isID(options?: {
        includeLists: boolean;
    }): boolean;
    isInt(options?: {
        includeLists: boolean;
    }): boolean;
    isFloat(options?: {
        includeLists: boolean;
    }): boolean;
    isString(options?: {
        includeLists: boolean;
    }): boolean;
    isCartesianPoint(options?: {
        includeLists: boolean;
    }): boolean;
    isPoint(options?: {
        includeLists: boolean;
    }): boolean;
    isBigInt(options?: {
        includeLists: boolean;
    }): boolean;
    isDate(options?: {
        includeLists: boolean;
    }): boolean;
    isDateTime(options?: {
        includeLists: boolean;
    }): boolean;
    isLocalDateTime(options?: {
        includeLists: boolean;
    }): boolean;
    isTime(options?: {
        includeLists: boolean;
    }): boolean;
    isLocalTime(options?: {
        includeLists: boolean;
    }): boolean;
    isDuration(options?: {
        includeLists: boolean;
    }): boolean;
    isObject(options?: {
        includeLists: boolean;
    }): boolean;
    isEnum(options?: {
        includeLists: boolean;
    }): boolean;
    isInterface(options?: {
        includeLists: boolean;
    }): boolean;
    isUnion(options?: {
        includeLists: boolean;
    }): boolean;
    isList(): this is this & {
        type: ListType;
    };
    isUserScalar(options?: {
        includeLists: boolean;
    }): boolean;
    isTemporal(options?: {
        includeLists: boolean;
    }): boolean;
    isListElementRequired(): boolean;
    isRequired(): boolean;
    /**
     *
     * Schema Generator Stuff
     *
     */
    isGraphQLBuiltInScalar(options?: {
        includeLists: boolean;
    }): boolean;
    isSpatial(options?: {
        includeLists: boolean;
    }): boolean;
    isAbstract(options?: {
        includeLists: boolean;
    }): boolean;
    /**
     * Returns true for both built-in and user-defined scalars
     **/
    isScalar(options?: {
        includeLists: boolean;
    }): boolean;
    isNumeric(options?: {
        includeLists: boolean;
    }): boolean;
    /**
     *  END of category assertions
     */
    /**
     *
     * Schema Generator Stuff
     *
     */
    getTypePrettyName(): string;
    getTypeName(): string;
}
