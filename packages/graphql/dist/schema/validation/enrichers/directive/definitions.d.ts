import type { EnricherContext } from "../../EnricherContext";
import type { Enricher } from "../../types";
import type { CREATE_DIRECTIVE_DEFINITION_FN } from "./utils";
export declare function definitionsEnricher(enricherContext: EnricherContext, directiveName: string, createDefinitionFn: CREATE_DIRECTIVE_DEFINITION_FN): Enricher;
