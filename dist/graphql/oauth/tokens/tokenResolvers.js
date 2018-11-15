"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.tokenResolver = {
    Mutation: {
        /**
        * Cria o token baseado no clienteSecret e clientId da aplicação com o prazo de uma hora de expiração
        */
        createToken: (parent, input, { db, oauthApplication }, info) => {
            if (!oauthApplication) {
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({
                    code: 403,
                    messageError: 'Client id not found'
                });
            }
            else {
                const payload = { clientId: oauthApplication.clientId };
                const oauthApplicationSecret = oauthApplication.clientSecret;
                console.log(oauthApplication);
                return {
                    token: jwt.sign(payload, oauthApplicationSecret, { expiresIn: 43200 }),
                    expiresIn: 43200
                };
            }
        },
    },
    Query: {
        dummy: (paren, input, context, info) => {
            return true;
        }
    }
};
