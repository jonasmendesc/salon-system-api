import { extractJwtTokenApplicationMiddleware } from "./middleware/extractJwtTokenApplicationMiddleware";
import { extractJwtOauthMiddleware } from "./middleware/extractJwtOauthMiddleware";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import schemaResources from "./graphql/schemas/resources/schema";
import schemaApp from "./graphql/schemas/oauthApp/schema";
import schemaOauth from './graphql/schemas/oauth/schema';
import db from "./models";
import { extractJwtMiddleware } from "./middleware/extractJwtMiddleware";
import { DataloaderFactory } from "./graphql/dataloaders/dataloaderFactory";
import * as cors from "cors";
import { RequestedFields } from "./graphql/ast/requestedFields";

class App {
  public express: express.Application;
  private dataLoaderFactory: DataloaderFactory;
  private requestedFields: RequestedFields;

  constructor() {
    this.express = express();
    this.express.use(cors());
    this.init();
  }

  private init(): void {
    this.requestedFields = new RequestedFields();
    this.dataLoaderFactory = new DataloaderFactory(db, this.requestedFields);
    this.middleware();
  }

  private middleware(): void {
    /** End point com schema do graphql para consumir os recursos baseado no token da empresa */
    this.express.use(
      "/business-manager",
      extractJwtMiddleware(),
      (req, res, next) => {
        req["context"]["db"] = db;
        req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
        req["context"]["requestedFields"] = this.requestedFields;
        next();
      },
      graphqlHTTP(req => ({
        schema: schemaResources,
        graphiql: true, // process.env.NODE_ENV === "development",
        formatError(err) {
          return {
            message: err.message,
            code: err.originalError && err.originalError.code,
            locations: err.locations,
            path: err.path
          };
        },
        context: req["context"]
      }))
    );

    /** Esse schema deve ser somente para criar o token para baseado no clientid e clientSecret da Aplicação */

    this.express.use(
      "/oauth",
      extractJwtOauthMiddleware(),
      (req, res, next) => {
        req["context"]["db"] = db;
        req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
        req["context"]["requestedFields"] = this.requestedFields;
        next();
      },
      graphqlHTTP(req => ({
        schema: schemaOauth,
        graphiql: true, // process.env.NODE_ENV === "development",
        formatError(err) {
          return {
            message: err.message,
            code: err.originalError && err.originalError.code,
            locations: err.locations,
            path: err.path
          };
        },
        context: req["context"]
      }))
    );

    /** Esse end point para criar a empresa e retorna o token da empresa que foi criada ou já foi criada  */

    this.express.use("/application",
    extractJwtTokenApplicationMiddleware(),
    (req, res, next) => {
      req["context"]["db"] = db;
      req["context"]["dataloaders"] = this.dataLoaderFactory.getLoaders();
      req["context"]["requestedFields"] = this.requestedFields;
      next();
    },
    graphqlHTTP(req => ({
      schema: schemaApp,
      graphiql: true, // process.env.NODE_ENV === "development",
      formatError(err){
        return {
          message: err.message,
          code: err.originalError && err.originalError.code,
          locations: err.locations,
          path: err.path
        };
      },
      context: req["context"]
    }))
  );
  }
}

export default new App().express;
