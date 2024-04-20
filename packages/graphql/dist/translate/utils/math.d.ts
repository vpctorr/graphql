import type { GraphElement } from "../../classes";
interface MathDescriptor {
    dbName: string;
    graphQLType: string;
    fieldName: string;
    operationName: string;
    operationSymbol: string;
    value: number;
}
interface MathMatch {
    hasMatched: boolean;
    operatorName: string;
    propertyName: string;
}
export declare function matchMathField(graphQLFieldName: string): MathMatch;
export declare function mathDescriptorBuilder(value: number, entity: GraphElement, fieldMatch: MathMatch): MathDescriptor;
export declare function buildMathStatements(mathDescriptor: MathDescriptor, scope: string, withVars: string[], param: string): Array<string>;
export {};
