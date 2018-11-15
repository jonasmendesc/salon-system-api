"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const models_1 = require("../models");
exports.extractJwtTokenApplicationMiddleware = () => {
    return (req, resp, next) => {
        req["context"] = {};
        let authorizationToken = req.get("authorization");
        let token = authorizationToken ? authorizationToken.split(" ")[1] : undefined;
        if (!token) {
            return next();
        }
        else {
            let decode = jwt.decode(token);
            let clientId = decode.clientId;
            models_1.default.Authorization.findOne({
                where: { clientId: clientId, isActive: true }
            }).then((authorization) => {
                if (!authorization) {
                    return next();
                }
                else {
                    req["context"]["oauthApplication"] = {
                        id: authorization.id,
                        clientId: authorization.clientId,
                        clientSecret: authorization.clientSecret
                    };
                    req["context"]["authorization"] = authorizationToken;
                    return next();
                }
            });
        }
    };
};
