import { Integer } from "neo4j-driver";
import { getInheritedTypeNames, hydrateInterfaceWithImplementedTypesMap, } from "../utils/interface-to-implementing-types";
import { getPathToNode } from "../utils/path-parser";
import { parseArgumentToInt } from "../utils/utils";
export function WarnIfAMaxLimitCanBeBypassedThroughInterface() {
    return function () {
        const entityToMaxLimitMap = new Map();
        const interfaceToImplementingTypes = new Map();
        const doOnInterface = {
            leave(interfaceType) {
                const interfaceMax = entityToMaxLimitMap.get(interfaceType.name.value);
                if (!interfaceMax) {
                    return;
                }
                const concreteThatIsBypassed = (getInheritedTypeNames(interfaceType, interfaceToImplementingTypes) || []).find((typeName) => {
                    const concreteEntityLimit = entityToMaxLimitMap.get(typeName);
                    if (concreteEntityLimit && concreteEntityLimit.lessThan(interfaceMax)) {
                        return typeName;
                    }
                });
                if (concreteThatIsBypassed) {
                    console.warn(`Max limit set on ${concreteThatIsBypassed} may be bypassed by its interface ${interfaceType.name.value}. To fix this update the \`@limit\` max value on the interface type. Ignore this message if the behavior is intended!`);
                }
            },
        };
        const doOnObject = {
            enter(objectType) {
                hydrateInterfaceWithImplementedTypesMap(objectType, interfaceToImplementingTypes);
            },
            leave(objectType) {
                const concreteMax = entityToMaxLimitMap.get(objectType.name.value);
                if (!concreteMax) {
                    return;
                }
                const interfaceThatBypasses = (getInheritedTypeNames(objectType, interfaceToImplementingTypes) || []).find((typeName) => {
                    const interfaceMax = entityToMaxLimitMap.get(typeName);
                    if (!interfaceMax || interfaceMax.greaterThan(concreteMax)) {
                        return typeName;
                    }
                });
                if (interfaceThatBypasses) {
                    console.warn(`Max limit set on ${objectType.name.value} may be bypassed by its interface ${interfaceThatBypasses}. To fix this update the \`@limit\` max value on the interface type. Ignore this message if the behavior is intended!`);
                }
            },
        };
        return {
            Directive(directiveNode, _key, _parent, path, ancestors) {
                if (directiveNode.name.value !== "limit") {
                    return;
                }
                const [, traversedDef] = getPathToNode(path, ancestors);
                if (!traversedDef) {
                    return;
                }
                const maxArg = directiveNode.arguments?.find((a) => a.name.value === "max");
                const maxLimit = parseArgumentToInt(maxArg) || Integer.MAX_SAFE_VALUE;
                entityToMaxLimitMap.set(traversedDef.name.value, maxLimit);
            },
            ObjectTypeDefinition: doOnObject,
            ObjectTypeExtension: doOnObject,
            InterfaceTypeDefinition: doOnInterface,
            InterfaceTypeExtension: doOnInterface,
        };
    };
}
