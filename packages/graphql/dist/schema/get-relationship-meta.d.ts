import type { FieldDefinitionNode } from "graphql";
import type { RelationshipNestedOperationsOption, RelationshipQueryDirectionOption } from "../constants";
type RelationshipDirection = "IN" | "OUT";
type RelationshipMeta = {
    direction: RelationshipDirection;
    type: string;
    typeUnescaped: string;
    properties?: string;
    queryDirection: RelationshipQueryDirectionOption;
    nestedOperations: RelationshipNestedOperationsOption[];
    aggregate: boolean;
};
declare function getRelationshipMeta(field: FieldDefinitionNode, interfaceField?: FieldDefinitionNode): RelationshipMeta | undefined;
export default getRelationshipMeta;
