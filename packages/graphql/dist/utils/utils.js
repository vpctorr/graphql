/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { isInt } from "neo4j-driver";
/** Checks if value is string */
export function isString(value) {
    return typeof value === "string";
}
/** Checks if value is object (array not included) */
export function isObject(value) {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
}
/** Checks if value is a Record (Array and other BuiltIn Object not included)  */
export function isRecord(value) {
    return value !== undefined && value !== null && value.constructor.name === "Object";
}
/** Checks if two value have the same type */
export function isSameType(a, b) {
    return typeof a === typeof b && isObject(a) === isObject(b) && Array.isArray(a) === Array.isArray(b);
}
/** Checks if two objects have the number of properties */
export function haveSameLength(o1, o2) {
    return Object.keys(o1).length === Object.keys(o2).length;
}
/** Checks if value is a Neo4j int object */
export function isNeoInt(value) {
    return isInt(value);
}
/** Transforms a value to number, if possible */
export function toNumber(value) {
    return isNeoInt(value) ? value.toNumber() : value;
}
/** Makes sure input is an array, if not it turns into an array (empty array if input is null or undefined) */
export function asArray(raw) {
    if (Array.isArray(raw))
        return raw;
    if (raw === undefined || raw === null)
        return [];
    return [raw];
}
/** Filter all elements in an array, only leaving truthy values */
export function filterTruthy(arr) {
    return arr.filter((v) => !!v);
}
/** Check if both arrays share at least one element */
export function haveSharedElement(arr1, arr2) {
    for (const element of arr1) {
        if (arr2.includes(element))
            return true;
    }
    return false;
}
/** Removes duplicate elements of an array */
export function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}
/** Awaitable version of setTimeout */
export function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
/** Omits fields from record */
export function omitFields(obj, fields) {
    return Object.entries(obj)
        .filter((item) => !fields.includes(item[0]))
        .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
/** Keep only the provided fields from record */
export function filterFields(obj, fieldsToKeep) {
    return Object.entries(obj)
        .filter((item) => fieldsToKeep.includes(item[0]))
        .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
/** Rename the keys of given fields */
export function renameFields(obj, fieldNameMap) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = fieldNameMap[key] || key;
        acc[newKey] = value;
        return acc;
    }, {});
}
