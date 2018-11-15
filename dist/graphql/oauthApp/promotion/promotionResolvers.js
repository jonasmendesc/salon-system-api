"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authAppResolvers_1 = require("../../composable/authAppResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.promotionResolvers = {
    Mutation: {
        insertPromotion: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { input }, { db, oauthApplication }, info) => {
            return db.Promotion.find({ where: { dateTimeMonthInitial: input.dateTimeMonthInitial, dateTimeMonthEnd: input.dateTimeMonthEnd, isActive: true } })
                .then((promotion) => {
                if (promotion)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Essa promoção já está cadastrada" });
                if (input.dateTimeMonthInitial >= input.dateTimeMonthEnd)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Mes inicial não pode maior ou igual ao mes final!" });
                return db.sequelize.transaction((t) => {
                    input.isActive = true;
                    return db.Promotion.create(input, { transaction: t })
                        .then((promotion) => {
                        return promotion;
                    });
                });
            });
        }),
        deletePromotion: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { id }, { db, oauthApplication }, info) => {
            return db.sequelize.transaction((t) => {
                return db.Promotion.findById(id)
                    .then((promotion) => {
                    if (!promotion)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Promoao não foi encontrada" });
                    return promotion.destroy({ transaction: t })
                        .then(promotionDeleted => !!promotionDeleted);
                });
            });
        })
    },
    Query: {
        findPromotion: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { isActive }, { db, oauthApplication, requestedFields }, info) => {
            return db.Promotion.findAll({ where: { isActive: isActive }, order: ['dateTimeMonthInitial'] })
                .then((promotions) => { return promotions; });
        })
    }
};
