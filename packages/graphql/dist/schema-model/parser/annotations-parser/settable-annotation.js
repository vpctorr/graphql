import { settableDirective } from "../../../graphql/directives";
import { SettableAnnotation } from "../../annotation/SettableAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseSettableAnnotation(directive) {
    const { onCreate, onUpdate } = parseArguments(settableDirective, directive);
    return new SettableAnnotation({
        onCreate,
        onUpdate,
    });
}
