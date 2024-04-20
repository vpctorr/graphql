import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Relationship } from "../classes";
import type { RelationshipAdapter } from "../schema-model/relationship/model-adapters/RelationshipAdapter";
declare function createSetRelationshipProperties({ properties, varName, withVars, relationship, relationshipAdapter, operation, callbackBucket, parameterPrefix, }: {
    properties: Record<string, Record<string, unknown>>;
    varName: string;
    withVars: string[];
    relationship: Relationship;
    relationshipAdapter?: RelationshipAdapter;
    operation: "CREATE" | "UPDATE";
    callbackBucket: CallbackBucket;
    parameterPrefix: string;
}): string | undefined;
export default createSetRelationshipProperties;
