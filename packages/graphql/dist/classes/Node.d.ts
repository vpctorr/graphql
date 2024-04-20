import type { DirectiveNode, NamedTypeNode } from "graphql";
import type { ConnectionField, CustomEnumField, CustomScalarField, CypherField, FullText, InterfaceField, ObjectField, PointField, PrimitiveField, RelationField, TemporalField, UnionField } from "../types";
import type { DecodedGlobalId } from "../utils/global-ids";
import type { GraphElementConstructor } from "./GraphElement";
import { GraphElement } from "./GraphElement";
import type { NodeDirective } from "./NodeDirective";
import type { LimitDirective } from "./LimitDirective";
import type { Neo4jGraphQLContext } from "../types/neo4j-graphql-context";
export interface NodeConstructor extends GraphElementConstructor {
    name: string;
    relationFields: RelationField[];
    connectionFields: ConnectionField[];
    cypherFields: CypherField[];
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    otherDirectives: DirectiveNode[];
    propagatedDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    temporalFields: TemporalField[];
    pointFields: PointField[];
    plural?: string;
    fulltextDirective?: FullText;
    nodeDirective?: NodeDirective;
    description?: string;
    limitDirective?: LimitDirective;
    isGlobalNode?: boolean;
    globalIdField?: string;
    globalIdFieldIsInt?: boolean;
}
type MutableField = PrimitiveField | CustomScalarField | CustomEnumField | UnionField | TemporalField | CypherField;
type AuthableField = PrimitiveField | CustomScalarField | CustomEnumField | UnionField | TemporalField | CypherField;
type ConstrainableField = PrimitiveField | CustomScalarField | CustomEnumField | TemporalField;
export type RootTypeFieldNames = {
    create: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
    subscribe: {
        created: string;
        updated: string;
        deleted: string;
        relationship_created: string;
        relationship_deleted: string;
    };
};
export type FulltextTypeNames = {
    result: string;
    where: string;
    sort: string;
};
export type AggregateTypeNames = {
    selection: string;
    input: string;
};
export type MutationResponseTypeNames = {
    create: string;
    update: string;
};
export type SubscriptionEvents = {
    create: string;
    update: string;
    delete: string;
    create_relationship: string;
    delete_relationship: string;
};
declare class Node extends GraphElement {
    relationFields: RelationField[];
    connectionFields: ConnectionField[];
    cypherFields: CypherField[];
    otherDirectives: DirectiveNode[];
    propagatedDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    nodeDirective?: NodeDirective;
    fulltextDirective?: FullText;
    description?: string;
    limit?: LimitDirective;
    singular: string;
    plural: string;
    isGlobalNode: boolean | undefined;
    private _idField;
    private _idFieldIsInt?;
    constructor(input: NodeConstructor);
    get mutableFields(): MutableField[];
    /** Fields you can apply auth allow and bind to */
    get authableFields(): AuthableField[];
    get constrainableFields(): ConstrainableField[];
    get uniqueFields(): ConstrainableField[];
    private get pascalCaseSingular();
    private get pascalCasePlural();
    get rootTypeFieldNames(): RootTypeFieldNames;
    get fulltextTypeNames(): FulltextTypeNames;
    get aggregateTypeNames(): AggregateTypeNames;
    get mutationResponseTypeNames(): MutationResponseTypeNames;
    get subscriptionEventTypeNames(): SubscriptionEvents;
    get subscriptionEventPayloadFieldNames(): SubscriptionEvents;
    getLabelString(context: Neo4jGraphQLContext): string;
    /**
     * Returns the list containing labels mapped with the values contained in the Context.
     * Be careful when using this method, labels returned are unescaped.
     **/
    getLabels(context: Neo4jGraphQLContext): string[];
    getMainLabel(): string;
    getAllLabels(): string[];
    getGlobalIdField(): string;
    toGlobalId(id: string): string;
    fromGlobalId(relayId: string): DecodedGlobalId;
    private generateSingular;
    private generatePlural;
}
export default Node;
