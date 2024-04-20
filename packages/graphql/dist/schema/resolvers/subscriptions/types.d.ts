export type SubscriptionEventType = "create" | "update" | "delete" | "create_relationship" | "delete_relationship";
export type StandardType = Record<string, Record<string, unknown>>;
export type UnionType = Record<string, StandardType>;
export type InterfaceType = Record<string, unknown>;
export type InterfaceSpecificType = Record<string, Record<string, unknown>>;
export type RecordType = Record<string, unknown>;
export type RelationshipType = Record<string, Record<string, UnionType | InterfaceType | StandardType>>;
