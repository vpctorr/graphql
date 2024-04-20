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
import { Node } from "../classes";
import { asArray, haveSharedElement } from "../utils/utils";
import getObjFieldMeta from "./get-obj-field-meta";
import parseNodeDirective from "./parse-node-directive";
import parseFulltextDirective from "./parse/parse-fulltext-directive";
import { parseLimitDirective } from "./parse/parse-limit-directive";
import parsePluralDirective from "./parse/parse-plural-directive";
function getNodes(definitionNodes, options) {
    let pointInTypeDefs = false;
    let cartesianPointInTypeDefs = false;
    let floatWhereInTypeDefs = false;
    const relationshipPropertyInterfaceNames = new Set();
    const interfaceRelationshipNames = new Set();
    const nodes = definitionNodes.objectTypes
        .filter((definition) => {
        const directiveNames = (definition.directives || []).map((d) => d.name.value);
        const excludeObjectFromNode = haveSharedElement(directiveNames, ["relationshipProperties"]);
        return !excludeObjectFromNode;
    })
        .map((definition) => {
        const otherDirectives = (definition.directives || []).filter((x) => ![
            "authorization",
            "authentication",
            "exclude",
            "node",
            "fulltext",
            "limit",
            "plural",
            "shareable",
            "subscriptionsAuthorization",
            "deprecated",
            "query",
            "mutation",
            "subscription",
            "jwt",
        ].includes(x.name.value));
        const propagatedDirectives = (definition.directives || []).filter((x) => ["deprecated", "shareable"].includes(x.name.value));
        const nodeDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "node");
        const pluralDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "plural");
        const fulltextDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "fulltext");
        const limitDirectiveDefinition = (definition.directives || []).find((x) => x.name.value === "limit");
        const nodeInterfaces = [...(definition.interfaces || [])];
        let nodeDirective;
        if (nodeDirectiveDefinition) {
            nodeDirective = parseNodeDirective(nodeDirectiveDefinition);
        }
        const userCustomResolvers = asArray(options.userCustomResolvers);
        const customResolvers = userCustomResolvers.find((r) => !!r[definition.name.value])?.[definition.name.value];
        const nodeFields = getObjFieldMeta({
            obj: definition,
            enums: definitionNodes.enumTypes,
            interfaces: definitionNodes.interfaceTypes,
            objects: definitionNodes.objectTypes,
            scalars: definitionNodes.scalarTypes,
            unions: definitionNodes.unionTypes,
            callbacks: options.callbacks,
            customResolvers,
        });
        let fulltextDirective;
        if (fulltextDirectiveDefinition) {
            fulltextDirective = parseFulltextDirective({
                directive: fulltextDirectiveDefinition,
                nodeFields,
                definition,
            });
            floatWhereInTypeDefs = true;
        }
        let limitDirective;
        if (limitDirectiveDefinition) {
            limitDirective = parseLimitDirective({
                directive: limitDirectiveDefinition,
                definition,
            });
        }
        nodeFields.relationFields.forEach((relationship) => {
            if (relationship.properties) {
                relationshipPropertyInterfaceNames.add(relationship.properties);
            }
            if (relationship.interface) {
                interfaceRelationshipNames.add(relationship.typeMeta.name);
            }
        });
        if (!pointInTypeDefs) {
            pointInTypeDefs = nodeFields.pointFields.some((field) => field.typeMeta.name === "Point");
        }
        if (!cartesianPointInTypeDefs) {
            cartesianPointInTypeDefs = nodeFields.pointFields.some((field) => field.typeMeta.name === "CartesianPoint");
        }
        const globalIdFields = nodeFields.primitiveFields.filter((field) => field.isGlobalIdField);
        const globalIdField = globalIdFields[0];
        const node = new Node({
            name: definition.name.value,
            interfaces: nodeInterfaces,
            otherDirectives,
            propagatedDirectives,
            ...nodeFields,
            // @ts-ignore we can be sure it's defined
            nodeDirective,
            // @ts-ignore we can be sure it's defined
            fulltextDirective,
            limitDirective,
            description: definition.description?.value,
            isGlobalNode: Boolean(globalIdField),
            globalIdField: globalIdField?.fieldName,
            globalIdFieldIsInt: globalIdField?.typeMeta?.name === "Int",
            plural: parsePluralDirective(pluralDirectiveDefinition),
        });
        return node;
    });
    return {
        nodes,
        pointInTypeDefs,
        cartesianPointInTypeDefs,
        floatWhereInTypeDefs,
        relationshipPropertyInterfaceNames,
        interfaceRelationshipNames,
    };
}
export default getNodes;
