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
import { buildSubgraphSchema } from "@apollo/subgraph";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { Kind, parse, print } from "graphql";
import { translateResolveReference } from "../translate/translate-resolve-reference";
import { execute } from "../utils";
import getNeo4jResolveTree from "../utils/get-neo4j-resolve-tree";
import { isInArray } from "../utils/is-in-array";
// TODO fetch the directive names from the spec
const federationDirectiveNames = [
    "key",
    "extends",
    "shareable",
    "inaccessible",
    "override",
    "external",
    "provides",
    "requires",
    "tag",
    "composeDirective",
    "interfaceObject",
];
export class Subgraph {
    constructor(typeDefs) {
        this.typeDefs = typeDefs;
        this.importArgument = new Map([
            ["key", "federation__key"],
            ["extends", "federation__extends"],
            ["shareable", "federation__shareable"],
            ["inaccessible", "federation__inaccessible"],
            ["override", "federation__override"],
            ["external", "federation__external"],
            ["provides", "federation__provides"],
            ["requires", "federation__requires"],
            ["tag", "federation__tag"],
            ["composeDirective", "federation__composeDirective"],
            ["interfaceObject", "federation__interfaceObject"],
        ]);
        const linkMeta = this.findFederationLinkMeta(typeDefs);
        if (!linkMeta) {
            throw new Error(`typeDefs must contain \`@link\` schema extension to be used with Apollo Federation`);
        }
        const { extension, directive: linkDirective } = linkMeta;
        this.linkExtension = extension;
        this.parseLinkImportArgument(linkDirective);
    }
    getFullyQualifiedDirectiveName(name) {
        return this.importArgument.get(name);
    }
    buildSchema({ typeDefs, resolvers }) {
        return buildSubgraphSchema({
            typeDefs,
            resolvers,
        });
    }
    getReferenceResolvers(schemaModel) {
        const resolverMap = {};
        const document = mergeTypeDefs(this.typeDefs);
        document.definitions.forEach((def) => {
            if (def.kind === Kind.OBJECT_TYPE_DEFINITION) {
                const entity = schemaModel.getEntity(def.name.value);
                if (entity?.isConcreteEntity()) {
                    const keyAnnotation = entity.annotations.key;
                    // If there is a @key directive with `resolvable` set to false, then do not add __resolveReference
                    if (keyAnnotation && keyAnnotation.resolvable === false) {
                        return;
                    }
                }
                resolverMap[def.name.value] = {
                    __resolveReference: this.getReferenceResolver(schemaModel),
                };
            }
        });
        return resolverMap;
    }
    getReferenceResolver(schemaModel) {
        const __resolveReference = async (reference, context, info) => {
            const { __typename } = reference;
            const entityAdapter = schemaModel.getConcreteEntityAdapter(__typename);
            if (!entityAdapter) {
                throw new Error(`Unable to find matching entity with name ${__typename}`);
            }
            context.resolveTree = getNeo4jResolveTree(info);
            const { cypher, params } = translateResolveReference({
                context: context,
                entityAdapter,
                reference,
            });
            const executeResult = await execute({
                cypher,
                params,
                defaultAccessMode: "READ",
                context,
                info,
            });
            return executeResult.records[0]?.this;
        };
        return __resolveReference;
    }
    getValidationDefinitions() {
        const document = parse(print(this.linkExtension));
        const schema = buildSubgraphSchema({ typeDefs: document });
        const config = schema.toConfig();
        const directives = config.directives;
        const types = config.types;
        const enums = types.filter((t) => t.astNode?.kind === Kind.ENUM_TYPE_DEFINITION);
        const scalars = types.filter((t) => t.astNode?.kind === Kind.SCALAR_TYPE_DEFINITION);
        return {
            directives: [...directives],
            types: [...enums, ...scalars],
        };
    }
    findFederationLinkMeta(typeDefs) {
        const document = mergeTypeDefs(typeDefs);
        for (const definition of document.definitions) {
            if (definition.kind === Kind.SCHEMA_EXTENSION && definition.directives) {
                for (const directive of definition.directives) {
                    if (directive.name.value === "link" && directive.arguments) {
                        for (const argument of directive.arguments) {
                            if (argument.name.value === "url" && argument.value.kind === Kind.STRING) {
                                const url = argument.value.value;
                                if (url.startsWith("https://specs.apollo.dev/federation/v2")) {
                                    // Remove any other directives and operations from the extension
                                    // We only care for the `@link` directive
                                    const extensionWithLinkOnly = {
                                        ...definition,
                                        directives: definition.directives.filter((d) => d.name.value === "link"),
                                        operationTypes: [],
                                    };
                                    return { extension: extensionWithLinkOnly, directive };
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    trimDirectiveName(name) {
        return name.replace("@", "");
    }
    parseLinkImportArgument(directive) {
        const argument = directive.arguments?.find((arg) => arg.name.value === "import");
        if (argument) {
            if (argument.value.kind === Kind.LIST) {
                for (const value of argument.value.values) {
                    if (value.kind === Kind.STRING) {
                        const trimmedName = this.trimDirectiveName(value.value);
                        if (!isInArray(federationDirectiveNames, trimmedName)) {
                            throw new Error(`Encountered unknown Apollo Federation directive ${value.value}`);
                        }
                        this.importArgument.set(trimmedName, trimmedName);
                    }
                    if (value.kind === Kind.OBJECT) {
                        const name = value.fields.find((f) => f.name.value === "name");
                        const as = value.fields.find((f) => f.name.value === "as");
                        if (name?.value.kind === Kind.STRING) {
                            const trimmedName = this.trimDirectiveName(name.value.value);
                            if (!isInArray(federationDirectiveNames, trimmedName)) {
                                throw new Error(`Encountered unknown Apollo Federation directive ${name.value.value}`);
                            }
                            if (as?.value.kind !== Kind.STRING) {
                                throw new Error(`Alias for directive ${name.value.value} is not of type string`);
                            }
                            this.importArgument.set(trimmedName, this.trimDirectiveName(as.value.value));
                        }
                    }
                }
            }
        }
    }
}
