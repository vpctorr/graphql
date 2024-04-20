import { annotationsParsers } from "./annotation/Annotation";
import { SHAREABLE } from "../constants";
const additionalDirectives = [
    "alias",
    "relationship",
    "relationshipProperties",
    "declareRelationship",
    "node",
    SHAREABLE,
];
export const LIBRARY_DIRECTIVES = [
    ...Object.keys(annotationsParsers)
        // fields from the @key directive is intentionally excluded as it is not in use by our schema model
        .filter((key) => key !== "key"),
    ...additionalDirectives,
];
export const SCHEMA_CONFIGURATION_FIELD_DIRECTIVES = [
    "filterable",
    "selectable",
    "settable",
];
export const FIELD_DIRECTIVES = [
    "alias",
    "authentication",
    "authorization",
    "coalesce",
    "customResolver",
    "cypher",
    "default",
    "id",
    "jwtClaim",
    "populatedBy",
    "relationship",
    "relayId",
    "subscriptionsAuthorization",
    "timestamp",
    "unique",
    "declareRelationship",
    ...SCHEMA_CONFIGURATION_FIELD_DIRECTIVES,
];
export const SCHEMA_CONFIGURATION_OBJECT_DIRECTIVES = [
    "query",
    "mutation",
    "subscription",
];
const OBJECT_DIRECTIVES = [
    "authentication",
    "authorization",
    "subscriptionsAuthorization",
    "plural",
    "limit",
    "fulltext",
    "node",
    "jwt",
    SHAREABLE,
    "deprecated",
    "relationshipProperties",
    ...SCHEMA_CONFIGURATION_OBJECT_DIRECTIVES,
];
const INTERFACE_DIRECTIVES = ["query", "plural", "limit"];
const UNION_DIRECTIVES = ["query", "plural"];
