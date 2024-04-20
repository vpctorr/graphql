import type { Integer } from "neo4j-driver";
type LimitDirectiveConstructor = {
    default?: Integer;
    max?: Integer;
};
export declare class LimitDirective {
    private default?;
    private max?;
    constructor(limit: LimitDirectiveConstructor);
    getLimit(optionsLimit?: Integer | number): Integer | undefined;
}
export {};
