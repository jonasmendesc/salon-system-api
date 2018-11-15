import { AuthorizationInstance } from "../models/authorizationModel";
import { RequestHandler, Request, Response, NextFunction } from "express";
import db from "../models";

/**
 * Middleware para verificar foi passado o clientId
 */
export const extractJwtOauthMiddleware = (): RequestHandler => {
  return (req: Request, resp: Response, next: NextFunction): void => {
    req["context"] = {};
    let clientId = req.headers["clientid"];
    if (!clientId) return next();
    db.Authorization.findOne({
      where: { clientId: clientId, isActive: true, authorizationType: 'application' }
    }).then((authorization: AuthorizationInstance) => {
      if (!authorization) {
        return next();
      } else {
        req["context"]["oauthApplication"] = {
          clientId: authorization.clientId,
          clientSecret: authorization.clientSecret
        };
        return next();
      }
    });
  };
};
