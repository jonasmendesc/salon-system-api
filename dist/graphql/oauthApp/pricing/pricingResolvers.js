"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authAppResolvers_1 = require("../../composable/authAppResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.pricingResolvers = {
    Mutation: {
        insertPricingSale: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { pricingValue, pricingType }, { db, oauthApplication }, info) => {
            return db.sequelize.transaction((t) => {
                return db.Pricing.findOne({ where: { isActive: true, pricingType: pricingType } })
                    .then((pricing) => {
                    if (pricing)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Já existe um valor para esse tipo de preco!" });
                    return db.Pricing.create({ pricingValue: pricingValue, pricingType: pricingType, isActive: true }, { transaction: t })
                        .then((pricingNew) => { return pricingNew; });
                });
            });
        })
    },
    Query: {
        findPricing: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { filter }, { db, oauthApplication, requestedFields }, info) => {
            const filterCondition = { where: { isActive: filter.isActive }, attributes: requestedFields.getFields(info) };
            if ('pricingType' in filter)
                filterCondition.where['pricingType'] = filter.pricingType;
            return db.Pricing.findAll(filterCondition)
                .then((pricingies) => { return pricingies; });
        })
    }
};
