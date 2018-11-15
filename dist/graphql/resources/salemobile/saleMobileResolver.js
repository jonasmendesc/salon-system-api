"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
const util_1 = require("../../../utils/util");
exports.saleMobilesResolvers = {
    Sale: {
        saleMobiles: (sale, args, { db, requestedFields }, info) => {
            return db.SaleMobile.findAll({ where: { saleId: sale.get('id') }, attributes: requestedFields.getFields(info) })
                .then((saleMobiles) => saleMobiles);
        }
    },
    Mutation: {
        addPlanAdditional: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { dateTimeMonthPlan, amountMobile }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t) => {
                return db.Sale.findAll({ where: { isActive: true, companyId: authCompany.id } })
                    .then((sale) => {
                    if (!sale)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado um registro de venda válido` });
                    return db.Pricing.find({ where: { isActive: true, pricingType: 'MOBILE' } })
                        .then((pricing) => {
                        if (!pricing)
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Preço de venda para celualr não foi encontrado` });
                        return db.Promotion.find({ where: { isActive: true, dateTimeMonthInitial: { $lte: dateTimeMonthPlan }, dateTimeMonthEnd: { $gte: dateTimeMonthPlan } } })
                            .then((promotion) => {
                            var dateCurrent = new Date();
                            if (!promotion)
                                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado politica de desconto` });
                            let saleInput = {};
                            saleInput.saleTotal = util_1.truncade(amountMobile * Number(pricing.pricingValue));
                            saleInput.companyId = authCompany.id;
                            saleInput.dateTimeMonthPlan = dateTimeMonthPlan;
                            saleInput.discountPercentage = promotion.discountPercentage;
                            saleInput.isActive = false;
                            saleInput.proposed = false;
                            saleInput.discountValue = saleInput.discountPercentage > 0 ?
                                util_1.truncade(promotion.discountPercentage / 100 * saleInput.saleTotal) : 0.00;
                            saleInput.salePrincing = util_1.truncade(saleInput.saleTotal - saleInput.discountValue);
                            saleInput.freeVersion = false;
                            saleInput.freeDay = 0;
                            saleInput.dueDate = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + dateTimeMonthPlan)).toDateString();
                            saleInput.dueDateExtension = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + dateTimeMonthPlan)).toLocaleDateString("pt-BR", {
                                weekday: "long", year: "numeric", month: "short",
                                day: "numeric"
                            });
                            return db.Sale.create(saleInput, { transaction: t })
                                .then((sale) => {
                                let saleMobileAttributes = new Array();
                                for (let i = 0; i < amountMobile; i++) {
                                    let saleMobileAttribute = {
                                        companyId: authCompany.id,
                                        saleId: sale.id,
                                        dateTimeMonthPlan: sale.dateTimeMonthPlan,
                                        isActive: false,
                                        freeVersion: true,
                                        freeDay: 0,
                                        dueDate: sale.dueDate,
                                        dueDateExtension: sale.dueDateExtension,
                                        mobileValue: pricing.pricingValue
                                    };
                                    saleMobileAttributes.push(saleMobileAttribute);
                                }
                                return db.SaleMobile.bulkCreate(saleMobileAttributes, { transaction: t })
                                    .then((saleMobile) => sale);
                            });
                        });
                    });
                });
            });
        }),
        updateSaleMobile: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { licenseCode, isActive, serialNumber, nameMobile }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t) => {
                return db.SaleMobile.find({ where: { companyId: authCompany.id, licenseCode: licenseCode } })
                    .then((saleMobile) => {
                    if (!saleMobile)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado um dipositivo valido` });
                    let saleMobileUpdate = { isActive: isActive };
                    if (serialNumber)
                        saleMobileUpdate.serialNumber = serialNumber;
                    if (nameMobile)
                        saleMobileUpdate.nameMobile = nameMobile;
                    return saleMobile.update(saleMobileUpdate, { transaction: t })
                        .then((saleMobile) => {
                        return saleMobile;
                    });
                });
            });
        })
    }
};
