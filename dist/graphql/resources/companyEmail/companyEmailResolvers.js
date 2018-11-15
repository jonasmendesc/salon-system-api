"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.companyEmailResolvers = {
    Query: {
        getcompanyEmails: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { first = 10, offset = 0 }, { db, authCompany, requestedFields }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyEmail.findAll({
                where: {
                    companyId: authCompany.id
                },
                attributes: requestedFields.getFields(info),
                limit: first,
                offset: offset
            }).catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        })
    },
    Mutation: {
        insertEmails: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { emails }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let emailFinds = emails.map(email => email.email);
            return db.CompanyEmail.findAll({ where: { email: { $in: emailFinds }, companyId: authCompany.id } })
                .then((companyEmailInstances) => {
                if (companyEmailInstances && companyEmailInstances.length > 0) {
                    var emailSenders = companyEmailInstances.reduce((accum, curr) => {
                        if (accum)
                            return accum + ', ' + curr.email;
                        return curr.email;
                    }, "");
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: ` Email(s) já existem ${emailSenders}` });
                }
                else {
                    let companyEmails = emails.map(email => {
                        let companyEmail = {
                            companyId: authCompany.id,
                            email: email.email,
                            isMain: false,
                            isActive: true
                        };
                        return companyEmail;
                    });
                    return db.sequelize.transaction((t) => {
                        return db.CompanyEmail.bulkCreate(companyEmails, { transaction: t })
                            .then((companyEmails) => {
                            return companyEmails;
                        }).catch((err) => {
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                        });
                    });
                }
            }).catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
            ;
        }),
        updateEmail: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { input }, { db, authCompany }, info) => {
            return db.sequelize
                .transaction((t) => {
                if (!authCompany)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
                return db.CompanyEmail.findOne({ where: { id: input.id } })
                    .then((companyEmail) => {
                    if (!companyEmail)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: ` Email : ${input.id} não foi encontrado` });
                    if (companyEmail.isMain)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Email principal não pode ser alterado` });
                    return companyEmail.update({ email: input.email, isActive: input.isActive, isValidade: input.isValidade }, {
                        transaction: t,
                        where: { id: input.id }
                    }).then((companyEmailInstace) => {
                        return companyEmailInstace;
                    }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
                }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
            }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        }),
        deleteEmail: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { emailId }, { db, authCompany }, info) => {
            return db.sequelize
                .transaction((t) => {
                if (!authCompany)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
                return db.CompanyEmail.findOne({ where: { id: emailId } })
                    .then((companyEmail) => {
                    if (!companyEmail)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Email : ${emailId} não foi encontrado` });
                    if (companyEmail.isMain)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Email principal não pode ser removido` });
                    return companyEmail.destroy({ transaction: t })
                        .then(email => !!email)
                        .catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
                }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
            }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        })
    } // fim do mutation
};
