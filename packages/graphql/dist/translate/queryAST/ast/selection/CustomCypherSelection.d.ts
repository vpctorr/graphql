import Cypher from "@neo4j/cypher-builder";
import { QueryASTContext } from "../QueryASTContext";
import { EntitySelection, type SelectionClause } from "./EntitySelection";
import type { AttributeAdapter } from "../../../../schema-model/attribute/model-adapters/AttributeAdapter";
export declare class CustomCypherSelection extends EntitySelection {
    private operationField;
    private rawArguments;
    private cypherAnnotation;
    private isNested;
    constructor({ operationField, rawArguments, isNested, }: {
        operationField: AttributeAdapter;
        rawArguments: Record<string, any>;
        isNested: boolean;
    });
    apply(context: QueryASTContext): {
        nestedContext: QueryASTContext<Cypher.Node>;
        selection: SelectionClause;
    };
}
