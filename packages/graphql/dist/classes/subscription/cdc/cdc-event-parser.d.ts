import type { Neo4jGraphQLSchemaModel } from "../../../schema-model/Neo4jGraphQLSchemaModel";
import type { SubscriptionsEvent } from "../../../types";
import type { CDCQueryResponse } from "./cdc-types";
export declare class CDCEventParser {
    private schemaModel;
    constructor(schemaModel: Neo4jGraphQLSchemaModel);
    parseCDCEvent({ event: cdcEvent, metadata }: CDCQueryResponse): SubscriptionsEvent | undefined;
    private parseNodeEvent;
    private parseRelationshipEvent;
    private getTypenamesFromLabels;
}
