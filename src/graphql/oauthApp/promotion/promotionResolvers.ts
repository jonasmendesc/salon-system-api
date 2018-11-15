import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphQLResolveInfo } from "graphql";
import { compose } from "../../composable/composableResolvers";
import { authAppResolvers } from "../../composable/authAppResolvers";
import { Transaction } from "sequelize";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { PromotionInstance } from "../../../models/promotionModel";
import { RequestedFields } from "../../ast/requestedFields";

export const promotionResolvers = {

  Mutation: {
      insertPromotion: compose(...authAppResolvers)((parent, { input }, { db, oauthApplication } : {  db: DbConnection, oauthApplication: OAuthApplication }, info: GraphQLResolveInfo) => {
        return db.Promotion.find({ where : { dateTimeMonthInitial: input.dateTimeMonthInitial, dateTimeMonthEnd: input.dateTimeMonthEnd, isActive: true } } )
          .then((promotion: PromotionInstance) => {
            if(promotion) throw new GraphqlRequestRestError({ code: 422, messageError: "Essa promoção já está cadastrada" });
            if(input.dateTimeMonthInitial >= input.dateTimeMonthEnd) throw new GraphqlRequestRestError( { code: 422, messageError: "Mes inicial não pode maior ou igual ao mes final!" } );
            return db.sequelize.transaction((t: Transaction) => {
                input.isActive = true;
                return db.Promotion.create(input, { transaction: t })
                  .then((promotion: PromotionInstance) => {
                    return promotion;
                  })
            })
          })
      }),
      deletePromotion: compose(...authAppResolvers)((parent, { id }, { db, oauthApplication }: { db: DbConnection, oauthApplication : OAuthApplication }, info: GraphQLResolveInfo ) => {
        return db.sequelize.transaction((t: Transaction) => {
          return db.Promotion.findById(id)
            .then((promotion: PromotionInstance) => {
              if(!promotion) throw new GraphqlRequestRestError({ code: 422, messageError: "Promoao não foi encontrada" });
               return promotion.destroy({ transaction : t })
                .then(promotionDeleted => !!promotionDeleted );
            })
        })

      })
  },
  Query: {
    findPromotion: compose(...authAppResolvers)((parent, { isActive }, { db, oauthApplication, requestedFields }: { db: DbConnection, oauthApplication: OAuthApplication, requestedFields : RequestedFields }, info: GraphQLResolveInfo) => {
        return db.Promotion.findAll({ where: { isActive: isActive }, order: ['dateTimeMonthInitial'] })
          .then((promotions : PromotionInstance[]) => { return promotions; })
    })
  }

}
