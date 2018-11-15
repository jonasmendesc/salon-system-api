"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accountSchema_1 = require("../../oauthApp/account/accountSchema");
const pricingSchema_1 = require("../../oauthApp/pricing/pricingSchema");
const promotionSchema_1 = require("../../oauthApp/promotion/promotionSchema");
const Query = `
    type Query {
        ${accountSchema_1.companyQueries}
        ${pricingSchema_1.pricingQueries}
        ${promotionSchema_1.promotitonQueries}
    }
`;
exports.Query = Query;
