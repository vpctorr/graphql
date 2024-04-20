import { type GraphQLResolveInfo, type SelectionSetNode } from "graphql";
import type { ConnectionQueryArgs } from "../types";
export declare function connectionFieldResolver({ connectionFieldName, source, args, info, }: {
    connectionFieldName: string;
    source: any;
    args: ConnectionQueryArgs;
    info: GraphQLResolveInfo;
}): {
    [x: string]: any;
};
/**
 * Adapted from graphql-relay-js ConnectionFromArraySlice
 */
export declare function createConnectionWithEdgeProperties({ selectionSet, source, args, totalCount, }: {
    selectionSet: SelectionSetNode | undefined;
    source: any;
    args: {
        after?: string;
        first?: number;
    };
    totalCount: number;
}): {
    [x: string]: any[] | {
        [x: string]: any;
    };
};
