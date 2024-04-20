import type { DirectiveNode } from "graphql";
import type { Annotations } from "../annotation/Annotation";
export declare function parseAnnotations(directives: readonly DirectiveNode[]): Partial<Annotations>;
