"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const lodash_1 = require("lodash");
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const tokenSchema_1 = require("../../oauthApp/tokens/tokenSchema");
const authorizationSchema_1 = require("../../oauthApp/authorizations/authorizationSchema");
const accountSchema_1 = require("../../oauthApp/account/accountSchema");
const pricingSchema_1 = require("../../oauthApp/pricing/pricingSchema");
const promotionSchema_1 = require("../../oauthApp/promotion/promotionSchema");
const tokenResolvers_1 = require("../../oauthApp/tokens/tokenResolvers");
const authorizationResolvers_1 = require("../../oauthApp/authorizations/authorizationResolvers");
const accountResolvers_1 = require("../../oauthApp/account/accountResolvers");
const pricingResolvers_1 = require("../../oauthApp/pricing//pricingResolvers");
const promotionResolvers_1 = require("../../oauthApp/promotion/promotionResolvers");
const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;
const resolvers = lodash_1.merge(tokenResolvers_1.AppTokenResolvers, authorizationResolvers_1.authorizationResolvers, accountResolvers_1.companyResolvers, pricingResolvers_1.pricingResolvers, promotionResolvers_1.promotionResolvers);
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: [ShemaDefinitions, query_1.Query, mutation_1.Mutation, tokenSchema_1.tokenTypes, authorizationSchema_1.authorizationsTypes, accountSchema_1.companyCreatedTypes, pricingSchema_1.pricingTypes, promotionSchema_1.promotionTypes],
    resolvers
});
