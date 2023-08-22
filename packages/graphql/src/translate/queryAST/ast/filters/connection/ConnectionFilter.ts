import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntity } from "../../../../../schema-model/entity/ConcreteEntity";
import type { RelationshipWhereOperator } from "../../../../where/types";
import { Filter } from "../Filter";
import { QueryASTContext } from "../../QueryASTContext";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { QueryASTNode } from "../../QueryASTNode";

export class ConnectionFilter extends Filter {
    private innerFilters: Filter[] = [];
    private relationship: RelationshipAdapter;
    private operator: RelationshipWhereOperator;
    private isNot: boolean;

    private subqueryPredicate: Cypher.Predicate | undefined;

    constructor({
        relationship,
        operator,
        isNot,
    }: {
        relationship: RelationshipAdapter;
        operator: RelationshipWhereOperator | undefined;
        isNot: boolean;
    }) {
        super();
        this.relationship = relationship;
        this.isNot = isNot;
        this.operator = operator || "SOME";
    }

    public addFilters(filters: Filter[]): void {
        this.innerFilters.push(...filters);
    }

    public getChildren(): QueryASTNode[] {
        return [...this.innerFilters];
    }

    public getSubqueries(parentNode: Cypher.Node): Cypher.Clause[] {
        // FOr neo 5 this may not be needed
        const relatedEntity = this.relationship.target as ConcreteEntity;
        const target = new Cypher.Node({
            labels: relatedEntity.labels,
        });
        const relationship = new Cypher.Relationship({
            type: this.relationship.type,
        });

        const pattern = new Cypher.Pattern(parentNode)
            .withoutLabels()
            .related(relationship)
            .withDirection(this.relationship.getCypherDirection())
            .to(target);

        const nestedContext = new QueryASTContext({
            target,
            source: parentNode,
            relationship,
        });

        const match = new Cypher.Match(pattern);
        const match2 = new Cypher.Match(pattern);

        const truthyFilters: Cypher.Variable[] = [];
        const falsyFilters: Cypher.Variable[] = [];

        // TODO: this only works for ALL operations
        const subqueries1 = this.innerFilters.flatMap((f) => {
            const nestedSubqueries = f.getSubqueries(target).map((sq) => {
                const predicate = f.getPredicate(nestedContext);
                if (predicate) {
                    const returnVar = new Cypher.Variable();
                    truthyFilters.push(returnVar);
                    return new Cypher.Call(sq)
                        .innerWith(target)
                        .with("*")
                        .where(predicate)
                        .return([Cypher.gt(Cypher.count(target), new Cypher.Literal(0)), returnVar]); // THis variable needs to be used in predicate
                }
            });

            return nestedSubqueries;
        });

        if (subqueries1.length === 0) return []; // Hack logic to change predicates logic

        const subqueries2 = this.innerFilters.flatMap((f) => {
            const nestedSubqueries = f.getSubqueries(target).map((sq) => {
                const predicate = f.getPredicate(nestedContext);
                if (predicate) {
                    const returnVar = new Cypher.Variable();
                    falsyFilters.push(returnVar);
                    return new Cypher.Call(sq)
                        .innerWith(target)
                        .with("*")
                        .where(Cypher.not(predicate))
                        .return([Cypher.gt(Cypher.count(target), new Cypher.Literal(0)), returnVar]); // THis variable needs to be used in predicate
                }
            });

            return nestedSubqueries;
        });

        const falsyPredicates = falsyFilters.map((v) => Cypher.eq(v, Cypher.false));
        const truthyPredicates = truthyFilters.map((v) => Cypher.eq(v, Cypher.true));
        this.subqueryPredicate = Cypher.and(...falsyPredicates, ...truthyPredicates);

        return [Cypher.concat(match, ...subqueries1), Cypher.concat(match2, ...subqueries2)];
    }

    public getPredicate(queryASTContext: QueryASTContext): Cypher.Predicate | undefined {
        if (this.subqueryPredicate) return this.subqueryPredicate;
        else {
            //TODO: not concrete entities
            const relatedEntity = this.relationship.target as ConcreteEntity;
            const target = new Cypher.Node({
                labels: relatedEntity.labels,
            });
            const relationship = new Cypher.Relationship({
                type: this.relationship.type,
            });

            const pattern = new Cypher.Pattern(queryASTContext.target)
                .withoutLabels()
                .related(relationship)
                .withDirection(this.relationship.getCypherDirection())
                .to(target);

            const nestedContext = new QueryASTContext({ target, relationship, source: queryASTContext.target });

            const predicate = this.createRelationshipOperation(pattern, nestedContext);
            if (!predicate) return undefined;
            return this.wrapInNotIfNeeded(predicate);
        }
    }

    private createRelationshipOperation(
        pattern: Cypher.Pattern,
        nestedContext: QueryASTContext
    ): Cypher.Predicate | undefined {
        const connectionFilter = this.innerFilters.map((c) => c.getPredicate(nestedContext));
        const innerPredicate = Cypher.and(...connectionFilter);
        if (!innerPredicate) return undefined;

        switch (this.operator) {
            case "ALL": {
                const match = new Cypher.Match(pattern).where(innerPredicate);
                const negativeMatch = new Cypher.Match(pattern).where(Cypher.not(innerPredicate));
                // Testing "ALL" requires testing that at least one element exists and that no elements not matching the filter exists
                return Cypher.and(new Cypher.Exists(match), Cypher.not(new Cypher.Exists(negativeMatch)));
            }
            case "SINGLE": {
                const patternComprehension = new Cypher.PatternComprehension(pattern, new Cypher.Literal(1)).where(
                    innerPredicate
                );
                return Cypher.single(nestedContext.target, patternComprehension, new Cypher.Literal(true));
            }
            default: {
                const match = new Cypher.Match(pattern).where(innerPredicate);
                return new Cypher.Exists(match);
            }
        }
    }

    private wrapInNotIfNeeded(predicate: Cypher.Predicate): Cypher.Predicate {
        if (this.isNot) return Cypher.not(predicate);
        else return predicate;
    }
}