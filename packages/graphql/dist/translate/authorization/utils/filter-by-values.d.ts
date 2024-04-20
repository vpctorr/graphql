export declare function filterByValues<T>(whereInput: Record<string, T | Array<Record<string, T>> | Record<string, T>>, receivedValues: Record<string, T>, jwtClaims?: Map<string, string>): boolean;
