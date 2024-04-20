import { filterableDirective } from "../../../graphql/directives";
import { FilterableAnnotation } from "../../annotation/FilterableAnnotation";
import { parseArguments } from "../parse-arguments";
export function parseFilterableAnnotation(directive) {
    const { byValue, byAggregate } = parseArguments(filterableDirective, directive);
    return new FilterableAnnotation({
        byAggregate,
        byValue,
    });
}
