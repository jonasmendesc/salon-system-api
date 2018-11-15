import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { AuthorizationInstance } from "../../../models/authorizationModel";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";

export const authorizationResolvers = {
    
    Mutation : {
        createAuthorization :(parent, {name}, {db, oauthApplication} : {db : DbConnection, oauthApplication : OAuthApplication}, info : GraphQLResolveInfo ) => {
            return db.sequelize.transaction((t: Transaction) => {
                if(!name) throw new GraphqlRequestRestError({ code: 422, messageError: "Nome da aplicação deve ser preenchido!" })
                return db.Authorization.create({ name : name })
                    .then((authorization: AuthorizationInstance) => {
                        return authorization
                    })
            });
        }
    }

}