"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const graphqlRequestRestError_1 = require("../../utils/customerErrors/graphqlRequestRestError");
exports.verifyTokenAppREsolver = (resolver) => {
    return (parent, args, context, info) => {
        const token = context.authorization
            ? context.authorization.split(" ")[1]
            : undefined;
        return jwt.verify(token, context.oauthApplication.clientSecret, (err, decode) => {
            if (!err)
                return resolver(parent, args, context, info);
            throw new graphqlRequestRestError_1.GraphqlRequestRestError({
                code: 401,
                messageError: "Token invalid or not informed"
            });
        });
    };
};
