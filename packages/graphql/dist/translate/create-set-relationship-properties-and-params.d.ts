import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Relationship } from "../classes";
declare function createSetRelationshipPropertiesAndParams({ properties, varName, relationship, operation, callbackBucket, }: {
    properties: Record<string, unknown>;
    varName: string;
    relationship: Relationship;
    operation: "CREATE" | "UPDATE";
    callbackBucket: CallbackBucket;
}): [string, any];
export default createSetRelationshipPropertiesAndParams;
