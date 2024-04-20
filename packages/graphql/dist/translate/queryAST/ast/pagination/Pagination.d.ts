import Cypher from "@neo4j/cypher-builder";
import { type Integer } from "neo4j-driver";
import { QueryASTNode } from "../QueryASTNode";
export type PaginationField = {
    skip: Cypher.Param<number | Integer> | undefined;
    limit: Cypher.Param<number | Integer> | undefined;
};
export declare class Pagination extends QueryASTNode {
    private skip;
    private limit;
    constructor({ skip, limit }: {
        skip?: number | Integer;
        limit?: number | Integer;
    });
    getPagination(): PaginationField | undefined;
    getChildren(): QueryASTNode[];
    private toNeo4jInt;
    print(): string;
}
