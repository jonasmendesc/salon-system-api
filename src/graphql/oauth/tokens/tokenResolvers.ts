import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import * as jwt from "jsonwebtoken";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphQLResolveInfo } from "graphql";

export const tokenResolver = {
  Mutation: {
     /**
     * Cria o token baseado no clienteSecret e clientId da aplicação com o prazo de uma hora de expiração
     */
    createToken: (
      parent,
      input,
      {
        db,
        oauthApplication
      }: { db: DbConnection; oauthApplication: OAuthApplication },
      info: GraphQLResolveInfo
    ) => {
      if (!oauthApplication) {
        throw new GraphqlRequestRestError({
          code: 403,
          messageError: 'Client id not found'
        });
      } else {
        const payload = { clientId: oauthApplication.clientId };
        const oauthApplicationSecret = oauthApplication.clientSecret;
        console.log(oauthApplication);
        return {
          token: jwt.sign(payload, oauthApplicationSecret, { expiresIn: 43200 }),
          expiresIn: 43200
        };
      }
    }, 
  },

  Query: {
    dummy: (paren, input, context, info) => {
        return true;
    }
}

};
