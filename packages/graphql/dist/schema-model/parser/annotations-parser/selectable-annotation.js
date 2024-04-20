import { selectableDirective } from "../../../graphql/directives";
import { SelectableAnnotation } from "../../annotation/SelectableAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseSelectableAnnotation(directive) {
    const { onRead, onAggregate } = parseArguments(selectableDirective, directive);
    return new SelectableAnnotation({
        onRead,
        onAggregate,
    });
}
