"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.authorizationResolvers = {
    Mutation: {
        createAuthorization: (parent, { name }, { db, oauthApplication }, info) => {
            return db.sequelize.transaction((t) => {
                if (!name)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 422, messageError: "Nome da aplicação deve ser preenchido!" });
                return db.Authorization.create({ name: name })
                    .then((authorization) => {
                    return authorization;
                });
            });
        }
    }
};
