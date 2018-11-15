"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenSchema_1 = require("../../oauthApp/tokens/tokenSchema");
const authorizationSchema_1 = require("../../oauthApp/authorizations/authorizationSchema");
const accountSchema_1 = require("../../oauthApp/account/accountSchema");
const pricingSchema_1 = require("../../oauthApp/pricing/pricingSchema");
const promotionSchema_1 = require("../../oauthApp/promotion/promotionSchema");
const Mutation = `
  type Mutation {
    ${tokenSchema_1.tokenMutations}
    ${authorizationSchema_1.mutationsAuhorization}
    ${accountSchema_1.companyMutations}
    ${pricingSchema_1.pricingMutations}
    ${promotionSchema_1.promotionMutations}
  }
`;
exports.Mutation = Mutation;
