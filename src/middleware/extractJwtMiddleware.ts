import { AuthorizationInstance } from "./../models/authorizationModel";
import { RequestHandler, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import db from "../models";
import { CompanyInstance } from "../models/companyModel";

export const extractJwtMiddleware = (): RequestHandler => {
  return (req: Request, resp: Response, next: NextFunction): void => {
    let authorization: string = req.get("authorization");
    let token: string = authorization ? authorization.split(" ")[1] : undefined;
    req["context"] = {};
    req["context"]["authorization"] = authorization;
    if (!token) return next();
      var decodeValue: any = jwt.decode(token);
      if(!decodeValue.companyId) return next()
      db.Company.findById(decodeValue.companyId)
        .then((company: CompanyInstance) => {
          if (!company) {
           return next();
          } else {
            db.Authorization.findById(company.authorizationId)
              .then((authorization: AuthorizationInstance) => {
                jwt.verify(
                  token,
                  authorization.clientSecret,
                  (err, decode: any) => {
                    if (err) {
                      return next();
                    } else {
                      req["context"]["authCompany"] = {
                        id: company.get("id"),
                        clientId: authorization.clientId,
                        clientSecret: authorization.clientSecret
                      };
                      return next();
                    }
                  }
                );
              })
          }
        })

  };
};
