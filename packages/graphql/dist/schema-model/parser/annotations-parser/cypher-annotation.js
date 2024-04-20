import { Neo4jGraphQLSchemaValidationError } from "../../../classes";
import { CypherAnnotation } from "../../annotation/CypherAnnotation";
import { parseArguments } from "../parse-arguments";
import { cypherDirective } from "../../../graphql/directives";
export function parseCypherAnnotation(directive) {
    const { statement, columnName } = parseArguments(cypherDirective, directive);
    if (!statement || typeof statement !== "string") {
        throw new Neo4jGraphQLSchemaValidationError("@cypher statement required");
    }
    if (!columnName || typeof columnName !== "string") {
        throw new Neo4jGraphQLSchemaValidationError("@cypher columnName required");
    }
    return new CypherAnnotation({
        statement: statement,
        columnName: columnName,
    });
}
