import { GraphQLNonNull } from "graphql";
import { CreateInfo } from "../../graphql/objects/CreateInfo";
import { UpdateInfo } from "../../graphql/objects/UpdateInfo";
import { graphqlDirectivesToCompose } from "../to-compose";
export function withMutationResponseTypes({ concreteEntityAdapter, propagatedDirectives, composer, }) {
    composer.createObjectTC({
        name: concreteEntityAdapter.operations.mutationResponseTypeNames.create,
        fields: {
            info: new GraphQLNonNull(CreateInfo),
            [concreteEntityAdapter.plural]: `[${concreteEntityAdapter.name}!]!`,
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
    composer.createObjectTC({
        name: concreteEntityAdapter.operations.mutationResponseTypeNames.update,
        fields: {
            info: new GraphQLNonNull(UpdateInfo),
            [concreteEntityAdapter.plural]: `[${concreteEntityAdapter.name}!]!`,
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
}
