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
import { filterTruthy } from "../../../utils/utils";
import { populateWhereParams } from "../../authorization/utils/populate-where-params";
import { AuthorizationFilters } from "../ast/filters/authorization-filters/AuthorizationFilters";
import { AuthorizationRuleFilter } from "../ast/filters/authorization-filters/AuthorizationRuleFilter";
import { isConcreteEntity } from "../utils/is-concrete-entity";
export class AuthorizationFactory {
    constructor(filterFactory) {
        this.filterFactory = filterFactory;
    }
    getAuthFilters({ attributes, ...params }) {
        const authorizationFilters = this.createAuthFilterRule({
            ...params,
            authAnnotation: params.entity.annotations.authorization,
        });
        const authorizationValidate = this.createAuthValidateRule({
            ...params,
            authAnnotation: params.entity.annotations.authorization,
            when: "BEFORE",
        });
        const attributeAuthFilters = [];
        const attributeAuthValidate = [];
        if (attributes?.length && isConcreteEntity(params.entity)) {
            for (const attribute of attributes) {
                attributeAuthFilters.push(this.createAuthFilterRule({
                    ...params,
                    authAnnotation: attribute.annotations.authorization,
                }));
                attributeAuthValidate.push(this.createAuthValidateRule({
                    ...params,
                    when: "BEFORE",
                    authAnnotation: attribute.annotations.authorization,
                }));
            }
        }
        return filterTruthy([
            authorizationFilters,
            ...attributeAuthFilters,
            authorizationValidate,
            ...attributeAuthValidate,
        ]);
    }
    createAuthFilterRule({ authAnnotation, ...params }) {
        const whereFilters = this.createAuthRuleFilter(params, authAnnotation?.filter ?? []);
        if (!whereFilters.length) {
            return;
        }
        return new AuthorizationFilters({ validationFilters: [], whereFilters });
    }
    createAuthValidateRule({ authAnnotation, when, conditionForEvaluation, ...params }) {
        const rules = authAnnotation?.validate?.filter((rule) => rule.when.includes(when));
        const validationFilters = this.createAuthRuleFilter(params, rules ?? []);
        if (!validationFilters.length) {
            return;
        }
        return new AuthorizationFilters({ validationFilters, whereFilters: [], conditionForEvaluation });
    }
    createAuthRuleFilter(params, rules) {
        return rules
            .filter((rule) => rule.operations.some((operation) => params.operations.includes(operation)))
            .map((rule) => {
            const populatedWhere = populateWhereParams({ where: rule.where, context: params.context });
            const nestedFilters = this.filterFactory.createAuthFilters({ ...params, populatedWhere });
            return new AuthorizationRuleFilter({
                requireAuthentication: rule.requireAuthentication,
                filters: nestedFilters,
                isAuthenticatedParam: params.context.authorization.isAuthenticatedParam,
            });
        });
    }
}
