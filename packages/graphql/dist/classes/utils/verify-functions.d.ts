import type { Session } from "neo4j-driver";
export declare function verifyFunctions(sessionFactory: () => Session): Promise<void>;
