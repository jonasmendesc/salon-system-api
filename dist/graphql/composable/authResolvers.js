"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyTokenResolvers_1 = require("./verifyTokenResolvers");
exports.authResolver = (resolver) => {
    return (parent, args, context, info) => {
        if (context.authCompany || context.authorization)
            return resolver(parent, args, context, info);
        throw new Error("Unauthorized! Token not provided!");
    };
};
exports.authResolvers = [exports.authResolver, verifyTokenResolvers_1.verifyTokenResolver];
