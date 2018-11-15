"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractJwtTokenApplicationMiddleware_1 = require("./middleware/extractJwtTokenApplicationMiddleware");
const extractJwtOauthMiddleware_1 = require("./middleware/extractJwtOauthMiddleware");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema_1 = require("./graphql/schemas/resources/schema");
const schema_2 = require("./graphql/schemas/oauthApp/schema");
const schema_3 = require("./graphql/schemas/oauth/schema");
const models_1 = require("./models");
const extractJwtMiddleware_1 = require("./middleware/extractJwtMiddleware");
const dataloaderFactory_1 = require("./graphql/dataloaders/dataloaderFactory");
const cors = require("cors");
const requestedFields_1 = require("./graphql/ast/requestedFields");
class App {
    constructor() {
        this.express = express();
        this.express.use(cors());
        this.init();
    }
    init() {
        this.requestedFields = new requestedFields_1.RequestedFields();
        this.dataLoaderFactory = new dataloaderFactory_1.DataloaderFactory(models_1.default, this.requestedFields);
        this.middleware();
    }
    middleware() {
        /** End point com schema do graphql para consumir os recursos baseado no token da empresa */
        this.express.use("/business-manager", extractJwtMiddleware_1.extractJwtMiddleware(), (req, res, next) => {
            req["context"]["db"] = models_1.default;
            req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
            req["context"]["requestedFields"] = this.requestedFields;
            next();
        }, graphqlHTTP(req => ({
            schema: schema_1.default,
            graphiql: true,
            formatError(err) {
                return {
                    message: err.message,
                    code: err.originalError && err.originalError.code,
                    locations: err.locations,
                    path: err.path
                };
            },
            context: req["context"]
        })));
        /** Esse schema deve ser somente para criar o token para baseado no clientid e clientSecret da Aplicação */
        this.express.use("/oauth", extractJwtOauthMiddleware_1.extractJwtOauthMiddleware(), (req, res, next) => {
            req["context"]["db"] = models_1.default;
            req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
            req["context"]["requestedFields"] = this.requestedFields;
            next();
        }, graphqlHTTP(req => ({
            schema: schema_3.default,
            graphiql: true,
            formatError(err) {
                return {
                    message: err.message,
                    code: err.originalError && err.originalError.code,
                    locations: err.locations,
                    path: err.path
                };
            },
            context: req["context"]
        })));
        /** Esse end point para criar a empresa e retorna o token da empresa que foi criada ou já foi criada  */
        this.express.use("/application", extractJwtTokenApplicationMiddleware_1.extractJwtTokenApplicationMiddleware(), (req, res, next) => {
            req["context"]["db"] = models_1.default;
            req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
            req["context"]["requestedFields"] = this.requestedFields;
            next();
        }, graphqlHTTP(req => ({
            schema: schema_2.default,
            graphiql: true,
            formatError(err) {
                return {
                    message: err.message,
                    code: err.originalError && err.originalError.code,
                    locations: err.locations,
                    path: err.path
                };
            },
            context: req["context"]
        })));
    }
}
exports.default = new App().express;
