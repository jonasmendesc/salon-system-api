"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
/**
 * Middleware para verificar foi passado o clientId
 */
exports.extractJwtOauthMiddleware = () => {
    return (req, resp, next) => {
        req["context"] = {};
        let clientId = req.headers["clientid"];
        if (!clientId)
            return next();
        models_1.default.Authorization.findOne({
            where: { clientId: clientId, isActive: true, authorizationType: 'application' }
        }).then((authorization) => {
            if (!authorization) {
                return next();
            }
            else {
                req["context"]["oauthApplication"] = {
                    clientId: authorization.clientId,
                    clientSecret: authorization.clientSecret
                };
                return next();
            }
        });
    };
};
