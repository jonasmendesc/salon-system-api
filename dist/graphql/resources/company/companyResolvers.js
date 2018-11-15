"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../utils/util");
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.companyResolvers = {
    Company: {
        companyPhones: (company, args, { db, requestedFields }, info) => {
            return db.CompanyPhone.findAll({
                where: { companyId: company.get('id') },
                attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
            })
                .catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        },
        companyAddresses: (company, args, { db, requestedFields }, info) => {
            return db.CompanyAddress.findAll({
                where: { companyId: company.get('id') },
                attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
            })
                .catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        },
        companyEmails: (company, args, { db, requestedFields }, info) => {
            return db.CompanyEmail.findAll({
                where: { companyId: company.get('id') },
                attributes: requestedFields.getFields(info, { exclude: ['companyPhones', 'companyAddresses', 'companyEmails'] })
            })
                .catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        }
    },
    Query: {
        company: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, context, { db, authCompany }, info) => {
            return db.Company.findById(authCompany.id).then((company) => {
                util_1.thowError(!company, "Empresa não foi encontrada");
                return company;
            });
        })
    },
    Mutation: {
        updateCompany: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { input }, { db, authCompany }, info) => {
            return db.sequelize
                .transaction((t) => {
                return db.Company.findById(authCompany.id).then((company) => {
                    util_1.thowError(!company, "Empresa não foi encontrada");
                    return company.update(input, { transaction: t })
                        .then((companyChanged) => {
                        return companyChanged;
                    })
                        .catch((err) => {
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
                });
            })
                .catch(util_1.handlerError);
        }),
        updateCompanyPassword: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { input }, { db, authCompany }, info) => {
            return db.sequelize
                .transaction((t) => {
                return db.Company.findById(authCompany.id).then((company) => {
                    util_1.thowError(!company, "Empresa não foi encontrada");
                    let errorMessage = "Senhas estão incorretas verifica se a senha antiga foi digitada corretamente";
                    if (!company || !company.IsPassword(company.get("password"), input.oldPassword))
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 403, messageError: errorMessage });
                    return company
                        .update({ password: input.newPassword }, { transaction: t })
                        .then((company) => !!company)
                        .catch((err) => {
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
                });
            })
                .catch(util_1.handlerError);
        })
    }
};
