import { EnumType, GraphQLBuiltInScalarType, InputType, InterfaceType, ListType, Neo4jCartesianPointType, Neo4jGraphQLNumberType, Neo4jGraphQLSpatialType, Neo4jGraphQLTemporalType, Neo4jPointType, ObjectType, ScalarType, UnionType, UserScalarType, } from "./AttributeType";
export class AttributeTypeHelper {
    constructor(type) {
        this.type = type;
        this.assertionOptions = { includeLists: true };
    }
    /**
     * Just an helper to get the wrapped type in readonlyase of a list, useful for the assertions
     */
    getTypeForAssertion(includeLists) {
        if (includeLists) {
            if (!this.isList()) {
                return this.type;
            }
            if (this.type.ofType instanceof ListType) {
                return this.type.ofType.ofType;
            }
            return this.type.ofType;
        }
        return this.type;
    }
    isBoolean(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Boolean;
    }
    isID(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.ID;
    }
    isInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Int;
    }
    isFloat(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.Float;
    }
    isString(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === GraphQLBuiltInScalarType.String;
    }
    isCartesianPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof Neo4jCartesianPointType;
    }
    isPoint(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof Neo4jPointType;
    }
    isBigInt(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLNumberType.BigInt;
    }
    isDate(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.Date;
    }
    isDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.DateTime;
    }
    isLocalDateTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.LocalDateTime;
    }
    isTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ScalarType && type.name === Neo4jGraphQLTemporalType.Time;
    }
    isLocalTime(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === Neo4jGraphQLTemporalType.LocalTime;
    }
    isDuration(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name === Neo4jGraphQLTemporalType.Duration;
    }
    isObject(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof ObjectType;
    }
    isEnum(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof EnumType;
    }
    isInterface(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof InterfaceType;
    }
    isUnion(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof UnionType;
    }
    isList() {
        return this.type instanceof ListType;
    }
    isInput(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof InputType;
    }
    isUserScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type instanceof UserScalarType;
    }
    isTemporal(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in Neo4jGraphQLTemporalType;
    }
    isListElementRequired() {
        if (!(this.type instanceof ListType)) {
            return false;
        }
        return this.type.ofType.isRequired;
    }
    isRequired() {
        return this.type.isRequired;
    }
    isGraphQLBuiltInScalar(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in GraphQLBuiltInScalarType;
    }
    isSpatial(options = this.assertionOptions) {
        const type = this.getTypeForAssertion(options.includeLists);
        return type.name in Neo4jGraphQLSpatialType;
    }
    isAbstract(options = this.assertionOptions) {
        return this.isInterface(options) || this.isUnion(options);
    }
    isNumeric(options = this.assertionOptions) {
        return this.isBigInt(options) || this.isFloat(options) || this.isInt(options);
    }
    /**
     * Returns true for both built-in and user-defined scalars
     **/
    isScalar(options = this.assertionOptions) {
        return (this.isGraphQLBuiltInScalar(options) ||
            this.isTemporal(options) ||
            this.isBigInt(options) ||
            this.isUserScalar(options) ||
            this.isInput(options));
    }
}
