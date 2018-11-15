import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { OAuthApplication } from "../../../interfaces/OAuthApplicationInterface";
import { GraphQLResolveInfo } from "graphql";
import { compose } from "../../composable/composableResolvers";
import { authAppResolvers } from "../../composable/authAppResolvers";
import { Transaction } from "sequelize";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { PricingInstance } from "../../../models/pricingModel";
import { RequestedFields } from "../../ast/requestedFields";

export const pricingResolvers = {

  Mutation: {
        insertPricingSale: compose(...authAppResolvers)((parent, { pricingValue, pricingType }, { db, oauthApplication }: { db: DbConnection, oauthApplication: OAuthApplication }, info: GraphQLResolveInfo)  => {
          return db.sequelize.transaction((t: Transaction) => {
            return db.Pricing.findOne({ where : { isActive : true, pricingType : pricingType} })
              .then((pricing: PricingInstance) => {
                if(pricing) throw new GraphqlRequestRestError({ code: 422, messageError: "Já existe um valor para esse tipo de preco!" })
                return db.Pricing.create( { pricingValue: pricingValue, pricingType: pricingType, isActive: true }, { transaction: t })
                  .then((pricingNew: PricingInstance) => { return pricingNew; })
              })
          })
        })
  },
  Query: {
    findPricing: compose(...authAppResolvers)((parent, { filter }, { db, oauthApplication, requestedFields }: { db: DbConnection, oauthApplication: OAuthApplication, requestedFields : RequestedFields }, info: GraphQLResolveInfo) => {
      const filterCondition = {  where: { isActive: filter.isActive }, attributes: requestedFields.getFields(info) };
      if ('pricingType' in filter)
          filterCondition.where['pricingType'] = filter.pricingType;
      return db.Pricing.findAll(filterCondition)
        .then((pricingies: PricingInstance[]) => { return pricingies; })
    })
  }

}
