import { RelationshipNestedOperationsOption } from "../../constants";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { UnionEntityAdapter } from "../../schema-model/entity/model-adapters/UnionEntityAdapter";
import { createOnCreateITC } from "../create-relationship-fields/create-connect-or-create-field";
// TODO: refactor this
export function withConnectOrCreateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, ifUnionMemberEntity, }) {
    if (!relationshipAdapter.nestedOperations.has(RelationshipNestedOperationsOption.CONNECT_OR_CREATE)) {
        return;
    }
    let targetEntity;
    if (relationshipAdapter.target instanceof UnionEntityAdapter) {
        if (!ifUnionMemberEntity) {
            throw new Error("Expected member entity.");
        }
        targetEntity = ifUnionMemberEntity;
    }
    else {
        if (!(relationshipAdapter.target instanceof ConcreteEntityAdapter)) {
            throw new Error("Expected concrete target");
        }
        targetEntity = relationshipAdapter.target;
    }
    if (!relationshipAdapter.shouldGenerateFieldInputType(ifUnionMemberEntity) &&
        !relationshipAdapter.shouldGenerateUpdateFieldInputType(ifUnionMemberEntity)) {
        return;
    }
    const hasUniqueFields = targetEntity.uniqueFields.length > 0;
    if (hasUniqueFields !== true) {
        return;
    }
    createOnCreateITC({
        schemaComposer: composer,
        relationshipAdapter,
        targetEntityAdapter: targetEntity,
        userDefinedFieldDirectives,
    });
    // TODO: this should live in the where-fields.ts
    composer.getOrCreateITC(targetEntity.operations.connectOrCreateWhereInputTypeName, (tc) => {
        tc.addFields(targetEntity.operations.connectOrCreateWhereInputFieldNames);
    });
    const connectOrCreateName = relationshipAdapter.operations.getConnectOrCreateFieldInputTypeName(targetEntity);
    const connectOrCreateFieldInput = composer.getOrCreateITC(connectOrCreateName, (tc) => {
        tc.addFields(relationshipAdapter.operations.getConnectOrCreateInputFields(targetEntity) || {});
    });
    return connectOrCreateFieldInput;
}
export function withConnectOrCreateInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (relationshipAdapter.source instanceof UnionEntityAdapter) {
        throw new Error("Unexpected union source");
    }
    const typeName = relationshipAdapter.source.operations.connectOrCreateInputTypeName;
    const fieldInput = makeConnectOrCreateInputType({
        relationshipAdapter,
        composer,
        userDefinedFieldDirectives,
        deprecatedDirectives,
    });
    if (!fieldInput) {
        return;
    }
    const fields = makeConnectOrCreateInputTypeRelationshipField({
        relationshipAdapter,
        fieldInput,
        deprecatedDirectives,
    });
    const connectOrCreateInput = composer.getOrCreateITC(typeName);
    connectOrCreateInput.addFields(fields);
    return connectOrCreateInput;
}
function makeConnectOrCreateInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter) {
        return withRelationshipConnectOrCreateInputType({
            relationshipAdapter,
            composer,
            deprecatedDirectives,
            userDefinedFieldDirectives,
        });
    }
    return withConnectOrCreateFieldInputType({ relationshipAdapter, composer, userDefinedFieldDirectives });
}
function makeConnectOrCreateInputTypeRelationshipField({ relationshipAdapter, fieldInput, deprecatedDirectives, }) {
    if (relationshipAdapter.target instanceof UnionEntityAdapter) {
        return {
            [relationshipAdapter.name]: {
                type: fieldInput,
                directives: deprecatedDirectives,
            },
        };
    }
    return {
        [relationshipAdapter.name]: {
            type: relationshipAdapter.isList ? fieldInput.NonNull.List : fieldInput,
            directives: deprecatedDirectives,
        },
    };
}
function withRelationshipConnectOrCreateInputType({ relationshipAdapter, composer, userDefinedFieldDirectives, deprecatedDirectives, }) {
    const typeName = relationshipAdapter.operations.getConnectOrCreateInputTypeName();
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const fields = makeUnionConnectOrCreateInputTypeFields({
        relationshipAdapter,
        composer,
        deprecatedDirectives,
        userDefinedFieldDirectives,
    });
    if (!Object.keys(fields).length) {
        return;
    }
    const connectOrCreateInput = composer.createInputTC({ name: typeName, fields });
    return connectOrCreateInput;
}
function makeUnionConnectOrCreateInputTypeFields({ relationshipAdapter, composer, deprecatedDirectives, userDefinedFieldDirectives, }) {
    const fields = {};
    if (!(relationshipAdapter.target instanceof UnionEntityAdapter)) {
        throw new Error("Expected union target");
    }
    for (const memberEntity of relationshipAdapter.target.concreteEntities) {
        const fieldInput = withConnectOrCreateFieldInputType({
            relationshipAdapter,
            ifUnionMemberEntity: memberEntity,
            composer,
            userDefinedFieldDirectives,
        });
        if (fieldInput) {
            fields[memberEntity.name] = {
                type: relationshipAdapter.isList ? fieldInput.NonNull.List : fieldInput,
                directives: deprecatedDirectives,
            };
        }
    }
    return fields;
}
