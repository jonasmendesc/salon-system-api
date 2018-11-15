import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";

import { Mutation } from "./mutation";
import { Query } from "./query";

import { tokenTypes } from "../../oauthApp/tokens/tokenSchema";
import { authorizationsTypes } from "../../oauthApp/authorizations/authorizationSchema";
import { companyCreatedTypes } from "../../oauthApp/account/accountSchema";
import { pricingTypes } from "../../oauthApp/pricing/pricingSchema";
import { promotionTypes } from "../../oauthApp/promotion/promotionSchema";

import { AppTokenResolvers } from "../../oauthApp/tokens/tokenResolvers";
import { authorizationResolvers } from "../../oauthApp/authorizations/authorizationResolvers";
import { companyResolvers } from "../../oauthApp/account/accountResolvers";
import { pricingResolvers } from "../../oauthApp/pricing//pricingResolvers";
import { promotionResolvers } from "../../oauthApp/promotion/promotionResolvers";

const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;

const resolvers = merge(AppTokenResolvers, authorizationResolvers, companyResolvers, pricingResolvers, promotionResolvers);

export default makeExecutableSchema({
  typeDefs: [ShemaDefinitions, Query, Mutation, tokenTypes, authorizationsTypes, companyCreatedTypes, pricingTypes, promotionTypes],
  resolvers
});
