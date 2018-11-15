"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const models_1 = require("../models");
exports.extractJwtMiddleware = () => {
    return (req, resp, next) => {
        let authorization = req.get("authorization");
        let token = authorization ? authorization.split(" ")[1] : undefined;
        req["context"] = {};
        req["context"]["authorization"] = authorization;
        if (!token)
            return next();
        var decodeValue = jwt.decode(token);
        if (!decodeValue.companyId)
            return next();
        models_1.default.Company.findById(decodeValue.companyId)
            .then((company) => {
            if (!company) {
                return next();
            }
            else {
                models_1.default.Authorization.findById(company.authorizationId)
                    .then((authorization) => {
                    jwt.verify(token, authorization.clientSecret, (err, decode) => {
                        if (err) {
                            return next();
                        }
                        else {
                            req["context"]["authCompany"] = {
                                id: company.get("id"),
                                clientId: authorization.clientId,
                                clientSecret: authorization.clientSecret
                            };
                            return next();
                        }
                    });
                });
            }
        });
    };
};
