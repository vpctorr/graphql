/**
 * Utility function to ensure that the key exists in the map and avoid unnecessary type casting.
 * Get the value from a map, if the key does not exist throw an error.
 *
 * */
export declare function getFromMap<K extends keyof any, V>(map: Map<K, V>, key: K): V;
