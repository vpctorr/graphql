import type { EnricherContext } from "../../EnricherContext";
import type { Enricher } from "../../types";
import type { DIRECTIVE_TRANSFORM_FN } from "./utils";
export declare function directiveEnricher(enricherContext: EnricherContext, directiveName: string, transformFn: DIRECTIVE_TRANSFORM_FN): Enricher;
