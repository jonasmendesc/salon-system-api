"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
// Verifica o token que foi passado na requisição
exports.verifyTokenResolver = (resolver) => {
    return (parent, args, context, info) => {
        const token = context.authorization
            ? context.authorization.split(" ")[1]
            : undefined;
        return jwt.verify(token, context.authCompany.clientSecret, (err, decode) => {
            if (!err)
                return resolver(parent, args, context, info);
            throw new Error(`${err.name}: ${err.message}`);
        });
    };
};
