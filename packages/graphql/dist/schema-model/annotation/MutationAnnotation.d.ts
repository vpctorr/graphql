import type { MutationOperations } from "../../graphql/directives/mutation";
import type { Annotation } from "./Annotation";
export declare class MutationAnnotation implements Annotation {
    readonly name = "mutation";
    readonly operations: Set<MutationOperations>;
    constructor({ operations }: {
        operations: Set<MutationOperations>;
    });
}
