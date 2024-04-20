import type { Directive } from "../types";
export declare class NodeDirective implements Directive {
    labels: string[];
    addLabels(labels: string[]): void;
    toString(): string;
}
