"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
const util_1 = require("../../../utils/util");
exports.saleResolvers = {
    Sale: {
        saleMobiles: (sale, args, { db, requestedFields }, info) => {
            return db.SaleMobile.findAll({ where: { saleId: sale.get('id') }, attributes: requestedFields.getFields(info) })
                .then((saleMobiles) => saleMobiles);
        }
    },
    Mutation: {
        insertSale: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { input }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            var dateCurrent = new Date();
            return db.sequelize.transaction((t) => {
                if (input.freeVersion) {
                    let saleFree = {
                        companyId: authCompany.id,
                        dateTimeMonthPlan: 0,
                        discountPercentage: 0,
                        discountValue: 0.00,
                        freeDay: input.freeDay,
                        isActive: false,
                        dueDate: new Date(dateCurrent.setDate(dateCurrent.getDate() + input.freeDay ? input.freeDay : 7)).toDateString(),
                        dueDateExtension: new Date(dateCurrent.setDate(dateCurrent.getDate() + input.freeDay ? input.freeDay : 7)).toLocaleDateString("pt-BR", {
                            weekday: "long", year: "numeric", month: "short",
                            day: "numeric"
                        }),
                        freeVersion: input.freeVersion,
                        salePrincing: 0.00,
                        saleTotal: 0.00
                    };
                    return db.Sale.create(saleFree, { transaction: t })
                        .then((saleInstance) => {
                        return db.SaleMobile.create({ dueDate: saleInstance.dueDate, dueDateExtension: saleInstance.dueDateExtension, saleId: saleInstance.id, companyId: authCompany.id, dateTimeMonthPlan: 0, isActive: true, freeVersion: input.freeVersion, freeDay: input.freeDay, mobileValue: 0.00 }, { transaction: t })
                            .then((salemobile) => {
                            return saleInstance;
                        });
                    });
                }
                else {
                    if (input.dateTimeMonthPlan <= 0)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Quantidade de meses deve maior que zero!" });
                    return db.Promotion.find({ where: { dateTimeMonthInitial: { $lte: input.dateTimeMonthPlan }, dateTimeMonthEnd: { $gte: input.dateTimeMonthPlan } } })
                        .then((promotionInstance) => {
                        if (!promotionInstance)
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado nenhum valor para calculo" });
                        return db.Pricing.findAll({ where: { isActive: true, pricingType: { $in: ['PLAN', 'MOBILE'] } } })
                            .then((pricingInstances) => {
                            let pricingInstancePlan = pricingInstances.filter(x => x.pricingType == 'PLAN')[0];
                            let pricingInstanceMobile = pricingInstances.filter(x => x.pricingType == 'MOBILE')[0];
                            if (!pricingInstancePlan)
                                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado nenhum preço para o plano" });
                            if (!pricingInstanceMobile)
                                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado preço para o mobile" });
                            let saleInput = {};
                            saleInput.companyId = authCompany.id;
                            saleInput.dateTimeMonthPlan = input.dateTimeMonthPlan;
                            saleInput.isActive = false;
                            saleInput.proposed = input.proposed;
                            saleInput.saleTotal = 'saleMobiles' in input ?
                                util_1.truncade(Number(pricingInstancePlan.pricingValue) + (input.saleMobiles.amount * Number(pricingInstanceMobile.pricingValue))) :
                                pricingInstancePlan.pricingValue;
                            saleInput.discountValue = promotionInstance.discountPercentage > 0 ?
                                util_1.truncade(promotionInstance.discountPercentage / 100 * saleInput.saleTotal)
                                : promotionInstance.discountPercentage;
                            saleInput.salePrincing = util_1.truncade(saleInput.saleTotal - saleInput.discountValue);
                            saleInput.discountPercentage = util_1.truncade(promotionInstance.discountPercentage);
                            saleInput.freeVersion = false;
                            saleInput.freeDay = 0;
                            saleInput.dueDate = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + input.dateTimeMonthPlan)).toDateString();
                            saleInput.dueDateExtension = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + input.dateTimeMonthPlan)).toLocaleDateString("pt-BR", {
                                weekday: "long", year: "numeric", month: "short",
                                day: "numeric"
                            });
                            return db.Sale.create(saleInput, { transaction: t })
                                .then((sale) => {
                                if ('saleMobiles' in input) {
                                    let saleMobileAttributes = new Array();
                                    for (let i = 0; i < input.saleMobiles.amount; i++) {
                                        let saleMobileAttribute = {
                                            companyId: authCompany.id,
                                            saleId: sale.id,
                                            dateTimeMonthPlan: sale.dateTimeMonthPlan,
                                            isActive: false,
                                            freeVersion: true,
                                            freeDay: 0,
                                            dueDate: sale.dueDate,
                                            dueDateExtension: sale.dueDateExtension,
                                            mobileValue: pricingInstanceMobile.pricingValue
                                        };
                                        saleMobileAttributes.push(saleMobileAttribute);
                                    }
                                    return db.SaleMobile.bulkCreate(saleMobileAttributes, { transaction: t })
                                        .then((saleMobilesInstances) => sale);
                                }
                                else {
                                    return db.Sale.create(saleInput, { transaction: t })
                                        .then((saleInstance) => saleInstance);
                                }
                            });
                        });
                    });
                }
            });
        }),
        updateSale: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { isActive, licenseCode }, { db, authCompany, requestedFields }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t) => {
                return db.Sale.find({ where: { companyId: authCompany.id, licenseCode: licenseCode }, attributes: requestedFields.getFields(info, { exclude: ['saleMobiles'], keep: ['id'] }) })
                    .then((sale) => {
                    if (!sale)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Plano não foi encontrado" });
                    return sale.update({ isActive: isActive }, { transaction: t })
                        .then((saleUpdated) => saleUpdated);
                });
            });
        })
    },
    Query: {
        findSales: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { filter }, { db, authCompany, requestedFields }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let filterCondition = { where: { companyId: authCompany.id }, attributes: requestedFields.getFields(info, { exclude: ['saleMobiles'], keep: ['id'] }) };
            if (filter) {
                if ('isActive' in filter)
                    filterCondition.where['isActive'] = filter.isActive;
                if ('licenseCode' in filter)
                    filterCondition.where['licenseCode'] = filter.licenseCode;
            }
            return db.Sale.findAll(filterCondition)
                .then((sales) => sales);
        })
    }
};
