import Cypher from "@neo4j/cypher-builder";
import type { Argument } from "../../../schema-model/argument/Argument";
export declare function replaceArgumentsInStatement({ env, definedArguments, rawArguments, statement, }: {
    env: Cypher.Environment;
    definedArguments: Argument[];
    rawArguments: Record<string, any>;
    statement: string;
}): string;
