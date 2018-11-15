import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import * as jwt from "jsonwebtoken";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { CompanyInstance } from "../../../models/companyModel";
import { AuthorizationInstance } from "../../../models/authorizationModel";
import { authAppResolvers } from "../../composable/authAppResolvers";
import { compose } from "../../composable/composableResolvers";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { Transaction } from "sequelize";
import { CompanyEmailInstance } from "../../../models/companyEmailModel";

export const AppTokenResolvers = {
  Mutation: {
    /**
     * Cria o token para consumo do recursos da api para a empresa
     * Esse recurso baseado do token
     */
    createTokenCompany: compose(...authAppResolvers)((
      parent,
      { email, password },
      { db, oauthApplication }: { db: DbConnection, oauthApplication :  OAuthApplication}
    ) => {
           return db.CompanyEmail.find({ where : { email: email, isActive : true } })
            .then((companyEmail: CompanyEmailInstance) => {
                if(!companyEmail) throw new GraphqlRequestRestError( { code: 422, messageError: "Email ou senha são invalidos" })
                return db.Company.find({ where : { id: companyEmail.companyId } })
                  .then((company: CompanyInstance) => {
                    if(!company.IsPassword(company.password, password)) throw new GraphqlRequestRestError( { code: 422, messageError: "Email ou senha são invalidos" })
                    return db.Authorization.find({ where : { id: company.authorizationId } })
                      .then((authorization: AuthorizationInstance) => {
                        if(!authorization) throw new GraphqlRequestRestError({ code : 422, messageError: 'Esse token não tem autorizacao para criar token da emopresa' });
                        const payload = { companyId: company.id };
                        const SECRET = authorization.clientSecret;
                        return {
                          token: jwt.sign(payload, SECRET, { expiresIn: 3600 }),
                          expiresIn: 3600
                        };
                      })
                  })
            })
    })
  }
};
