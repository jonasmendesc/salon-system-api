"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyTokenAppResolvers_1 = require("./verifyTokenAppResolvers");
const graphqlRequestRestError_1 = require("../../utils/customerErrors/graphqlRequestRestError");
exports.authAppResolver = (resolver) => {
    return (parent, args, context, info) => {
        if (context.authorization || context.oauthApplication)
            return resolver(parent, args, context, info);
        throw new graphqlRequestRestError_1.GraphqlRequestRestError({
            code: 404,
            messageError: "Bad request token not provider!"
        });
    };
};
exports.authAppResolvers = [exports.authAppResolver, verifyTokenAppResolvers_1.verifyTokenAppREsolver];
