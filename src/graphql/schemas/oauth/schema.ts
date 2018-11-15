import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";

import { Mutation } from './mutation';
import { Query } from './query';

import { tokenResolver } from '../../oauth/tokens/tokenResolvers';

import { tokenTypes } from '../../oauth/tokens/tokenSchema';

const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;

const resolvers = merge(tokenResolver);
export default makeExecutableSchema({
    typeDefs: [ShemaDefinitions, Query, Mutation, tokenTypes],
    resolvers
});
