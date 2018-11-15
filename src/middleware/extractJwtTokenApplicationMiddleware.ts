import { AuthorizationInstance } from "./../models/authorizationModel";
import { NextFunction } from "express";
import { Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import db from "../models";

export const extractJwtTokenApplicationMiddleware = (): RequestHandler => {
  return (req: Request, resp: Response, next: NextFunction) => {
    req["context"] = {};
    let authorizationToken: string = req.get("authorization");
    let token: string = authorizationToken ? authorizationToken.split(" ")[1] : undefined;
    if (!token) {
       return next();
    } else {
      let decode: any = jwt.decode(token);
      let clientId = decode.clientId;
      db.Authorization.findOne({
        where: { clientId: clientId, isActive: true }
      }).then((authorization: AuthorizationInstance) => {
        if (!authorization) {
             return next();
        } else {
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
