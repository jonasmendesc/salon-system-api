"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
const authAppResolvers_1 = require("../../composable/authAppResolvers");
const composableResolvers_1 = require("../../composable/composableResolvers");
exports.AppTokenResolvers = {
    Mutation: {
        /**
         * Cria o token para consumo do recursos da api para a empresa
         * Esse recurso baseado do token
         */
        createTokenCompany: composableResolvers_1.compose(...authAppResolvers_1.authAppResolvers)((parent, { email, password }, { db, oauthApplication }) => {
            return db.CompanyEmail.find({ where: { email: email, isActive: true } })
                .then((companyEmail) => {
                if (!companyEmail)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Email ou senha são invalidos" });
                return db.Company.find({ where: { id: companyEmail.companyId } })
                    .then((company) => {
                    if (!company.IsPassword(company.password, password))
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Email ou senha são invalidos" });
                    return db.Authorization.find({ where: { id: company.authorizationId } })
                        .then((authorization) => {
                        if (!authorization)
                            throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: 'Esse token não tem autorizacao para criar token da emopresa' });
                        const payload = { companyId: company.id };
                        const SECRET = authorization.clientSecret;
                        return {
                            token: jwt.sign(payload, SECRET, { expiresIn: 3600 }),
                            expiresIn: 3600
                        };
                    });
                });
            });
        })
    }
};
