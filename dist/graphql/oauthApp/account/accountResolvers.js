"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
const composableResolvers_1 = require("../../composable/composableResolvers");
const authAppResolvers_1 = require("../../composable/authAppResolvers");
exports.companyResolvers = {
    CompanyCreated: {
        companyEmails: (company, args, { db, requestedFields }, info) => {
            return db.CompanyEmail.findAll({ where: { companyId: company.get('id') },
                attributes: requestedFields.getFields(info, { exclude: ['companyEmails'] }) })
                .catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        }
    },
    Mutation: {
        createCompany: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { input, emails }, { db, oauthApplication }, info) => {
            let emailsMain = emails.filter(x => x.isMain);
            if (emailsMain.length <= 0)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Email principal não foi encontrado" });
            if (emailsMain.length > 1)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Deve ser informado somente um email principal" });
            let emailMain = emailsMain[0];
            return db.CompanyEmail.find({ where: { email: emailMain.email }, attributes: ['id'] })
                .then((companyEmail) => {
                if (companyEmail)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Já existe esse email cadastrado!" });
                let authorization = { name: input.name, authorizationType: "company" };
                return db.sequelize.transaction((t) => {
                    return db.Authorization.create(authorization, { transaction: t })
                        .then((authorizationInstance) => {
                        let companyAttribute = {
                            authorizationId: authorizationInstance.id,
                            name: input.name,
                            password: input.password,
                        };
                        return db.Company.create(companyAttribute, { transaction: t })
                            .then((companyInstance) => {
                            let companyEmails = emails.map(email => {
                                let companyEmail = {
                                    companyId: companyInstance.id,
                                    email: email.email,
                                    isMain: email.isMain,
                                    isActive: true
                                };
                                return companyEmail;
                            });
                            return db.CompanyEmail.bulkCreate(companyEmails, { transaction: t })
                                .then((companyEmails) => {
                                return companyInstance;
                            }).catch((err) => {
                                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                            });
                        }).catch((err) => {
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                        });
                    }).catch((err) => {
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
                });
            }).catch((err) => {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
            });
        })
    },
    Query: {
        dummy: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { email }, { db, oauthApplication, requestedFields }, info) => {
            return true;
        })
    }
};
