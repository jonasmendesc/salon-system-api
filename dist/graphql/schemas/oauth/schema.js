"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const lodash_1 = require("lodash");
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const tokenResolvers_1 = require("../../oauth/tokens/tokenResolvers");
const tokenSchema_1 = require("../../oauth/tokens/tokenSchema");
const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;
const resolvers = lodash_1.merge(tokenResolvers_1.tokenResolver);
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: [ShemaDefinitions, query_1.Query, mutation_1.Mutation, tokenSchema_1.tokenTypes],
    resolvers
});
