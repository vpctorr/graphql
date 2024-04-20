import type { RelationshipAdapter } from "../../relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../relationship/model-adapters/RelationshipDeclarationAdapter";
export declare class ListFiltersAdapter {
    readonly relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    constructor(relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter);
    getAll(): {
        type: string;
        description: string;
    };
    getNone(): {
        type: string;
        description: string;
    };
    getSingle(): {
        type: string;
        description: string;
    };
    getSome(): {
        type: string;
        description: string;
    };
    get filters(): {
        type: string;
        description: string;
    }[];
    getConnectionAll(): {
        type: string;
        description: string;
    };
    getConnectionNone(): {
        type: string;
        description: string;
    };
    getConnectionSingle(): {
        type: string;
        description: string;
    };
    getConnectionSome(): {
        type: string;
        description: string;
    };
    get connectionFilters(): {
        type: string;
        description: string;
    }[];
}
