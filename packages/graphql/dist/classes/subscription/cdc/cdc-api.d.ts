import type { Driver, QueryConfig } from "neo4j-driver";
import type { CDCQueryResponse } from "./cdc-types";
export declare class CDCApi {
    private driver;
    private cursor;
    private queryConfig;
    constructor(driver: Driver, queryConfig?: QueryConfig);
    /** Queries events since last call to queryEvents */
    queryEvents(): Promise<CDCQueryResponse[]>;
    updateCursor(): Promise<void>;
    private fetchCurrentChangeId;
    private updateChangeIdWithLastEvent;
    private runProcedure;
}
