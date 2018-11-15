"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.companyPhoneResolvers = {
    Mutation: {
        insertCompanyPhone: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { phones }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let phonesFinds = phones.map(phone => phone.phone);
            return db.CompanyPhone.findAll({ where: { phone: { $in: phonesFinds }, companyId: authCompany.id } })
                .then((companyPhoneInstances) => {
                if (companyPhoneInstances && companyPhoneInstances.length > 0) {
                    var phoneSenders = companyPhoneInstances.reduce((accum, curr) => {
                        if (accum)
                            return accum + ', ' + curr.phone;
                        return curr.phone;
                    }, "");
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Telefone(s) já existem ${phoneSenders}` });
                }
                else {
                    let companyPhones = phones.map(phone => {
                        let companyPhone = {
                            companyId: authCompany.id,
                            phone: phone.phone,
                            isActive: true,
                            phoneType: phone.phoneType
                        };
                        return companyPhone;
                    });
                    return db.sequelize.transaction((t) => {
                        return db.CompanyPhone.bulkCreate(companyPhones, { transaction: t })
                            .then((companyPhones) => {
                            return companyPhones;
                        }).catch((err) => {
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                        });
                    });
                }
            }).catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        }),
        updateCompanyPhone: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { phone }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t) => {
                return db.CompanyPhone.findOne({ where: { companyId: authCompany.id, id: phone.id } })
                    .then((companyPhone) => {
                    if (!companyPhone)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: ` Telefone não foi encontrado ` });
                    return companyPhone.update({ phone: phone.phone, phoneType: phone.phoneType, isActive: phone.isActive }, { transaction: t })
                        .then((companyPhoneInstance) => {
                        return companyPhoneInstance;
                    }).catch((err) => {
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
                }).catch((err) => {
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                });
            });
        }),
        deleteCompanyPhone: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { id }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t) => {
                return db.CompanyPhone.findById(id)
                    .then((companyPhone) => {
                    if (!companyPhone)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: ` Telefone não foi encontrado ` });
                    return companyPhone.destroy({ transaction: t })
                        .then(companyPhoneInstance => !!companyPhoneInstance)
                        .catch((err) => {
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
                }).catch((err) => {
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                });
            });
        })
    },
    Query: {
        findCompanyPhone: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { filter }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            if (!filter) {
                return db.CompanyPhone.findAll({ where: { companyId: authCompany.id } })
                    .then((companyPhonesInstance) => {
                    return companyPhonesInstance;
                }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
            }
            let filterConditional = { where: { companyId: authCompany.id } };
            if ('isActive' in filter)
                filterConditional.where['isActive'] = filter.isActive;
            if ('phoneTypes' in filter) {
                filterConditional.where['phoneType'] = { $in: filter.phoneTypes };
            }
            return db.CompanyPhone.findAll(filterConditional)
                .then((companyPhonesInstance) => {
                return companyPhonesInstance;
            }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        })
    }
};
