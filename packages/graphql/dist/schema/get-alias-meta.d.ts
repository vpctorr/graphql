import type { DirectiveNode } from "graphql";
type AliasMeta = {
    property: string;
    propertyUnescaped: string;
};
declare function getAliasMeta(directive: DirectiveNode): AliasMeta | undefined;
export default getAliasMeta;
