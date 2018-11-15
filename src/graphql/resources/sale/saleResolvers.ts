import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { Dataloaders } from "../../../interfaces/DataloaderInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { SaleInstance, SaleAttribute } from "../../../models/saleModel";
import { SaleMobileInstance, SaleMobileAttributes } from "../../../models/saleMobileModel";
import { RequestedFields } from "../../ast/requestedFields";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { PromotionInstance } from "../../../models/promotionModel";
import { PricingInstance } from "../../../models/pricingModel";
import { truncade } from "../../../utils/util";

export const saleResolvers = {

  Sale: {
    saleMobiles: (sale, args, { db,requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
      return db.SaleMobile.findAll( { where: { saleId : sale.get('id') }, attributes: requestedFields.getFields(info) } )
        .then((saleMobiles: SaleMobileInstance[]) => saleMobiles);
    }
  },

  Mutation: {
    insertSale: compose(...authResolvers)((parent, { input }, { db, authCompany } : { db: DbConnection; authCompany: AuthCompany }, info : GraphQLResolveInfo) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
        var dateCurrent = new Date();
        return db.sequelize.transaction((t: Transaction) => {
          if(input.freeVersion){
            let saleFree : SaleAttribute = {
                companyId : authCompany.id,
                dateTimeMonthPlan: 0,
                discountPercentage: 0,
                discountValue: 0.00,
                freeDay: input.freeDay,
                isActive: false,
                dueDate: new Date(dateCurrent.setDate(dateCurrent.getDate() + input.freeDay ? input.freeDay : 7)).toDateString(),
                dueDateExtension: new Date(dateCurrent.setDate(dateCurrent.getDate() + input.freeDay ? input.freeDay : 7)).toLocaleDateString("pt-BR", {
                  weekday: "long", year: "numeric", month: "short",
                  day: "numeric"
                }),
                freeVersion: input.freeVersion,
                salePrincing: 0.00,
                saleTotal: 0.00
            };
           return db.Sale.create(saleFree, { transaction: t })
              .then((saleInstance: SaleInstance) => {
                  return db.SaleMobile.create({ dueDate: saleInstance.dueDate, dueDateExtension: saleInstance.dueDateExtension, saleId: saleInstance.id, companyId: authCompany.id, dateTimeMonthPlan: 0, isActive: true, freeVersion: input.freeVersion, freeDay: input.freeDay, mobileValue: 0.00 } , { transaction: t })
                  .then((salemobile: SaleMobileInstance) => {
                     return saleInstance;
                  })
              })
            }else{
              if(input.dateTimeMonthPlan <= 0) throw new GraphqlRequestRestError({ code: 422, messageError: "Quantidade de meses deve maior que zero!" });
              return db.Promotion.find( { where: {  dateTimeMonthInitial: { $lte: input.dateTimeMonthPlan }, dateTimeMonthEnd: { $gte: input.dateTimeMonthPlan }  } } )
                .then((promotionInstance: PromotionInstance) => {
                   if(!promotionInstance) throw new GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado nenhum valor para calculo" })
                   return db.Pricing.findAll( { where : { isActive: true, pricingType: { $in: ['PLAN', 'MOBILE'] } } } )
                      .then((pricingInstances: PricingInstance[]) => {

                          let pricingInstancePlan = pricingInstances.filter(x => x.pricingType == 'PLAN')[0];
                          let pricingInstanceMobile = pricingInstances.filter(x => x.pricingType == 'MOBILE')[0];

                          if(!pricingInstancePlan) throw new GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado nenhum preço para o plano" });
                          if(!pricingInstanceMobile) throw new GraphqlRequestRestError({ code: 422, messageError: "Não foi encontrado preço para o mobile" });

                          let saleInput : SaleAttribute = {};
                          saleInput.companyId = authCompany.id;
                          saleInput.dateTimeMonthPlan = input.dateTimeMonthPlan;
                          saleInput.isActive = false;
                          saleInput.proposed = input.proposed;
                          saleInput.saleTotal = 'saleMobiles' in input ?
                            truncade(Number(pricingInstancePlan.pricingValue) + (input.saleMobiles.amount * Number(pricingInstanceMobile.pricingValue))) :
                            pricingInstancePlan.pricingValue;
                            saleInput.discountValue = promotionInstance.discountPercentage > 0 ?
                            truncade(promotionInstance.discountPercentage / 100 * saleInput.saleTotal)
                            : promotionInstance.discountPercentage
                          saleInput.salePrincing = truncade(saleInput.saleTotal - saleInput.discountValue);
                          saleInput.discountPercentage = truncade(promotionInstance.discountPercentage);
                          saleInput.freeVersion = false;
                          saleInput.freeDay = 0;
                          saleInput.dueDate = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + input.dateTimeMonthPlan)).toDateString();
                          saleInput.dueDateExtension = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + input.dateTimeMonthPlan)).toLocaleDateString("pt-BR", {
                            weekday: "long", year: "numeric", month: "short",
                            day: "numeric"
                          });

                          return db.Sale.create(saleInput, { transaction: t })
                            .then((sale: SaleInstance) => {
                              if('saleMobiles' in input){
                                  let saleMobileAttributes: SaleMobileAttributes[] = new Array<SaleMobileAttributes>();
                                  for (let i = 0; i < input.saleMobiles.amount; i++) {
                                    let saleMobileAttribute : SaleMobileAttributes = {
                                      companyId : authCompany.id,
                                      saleId: sale.id,
                                      dateTimeMonthPlan: sale.dateTimeMonthPlan,
                                      isActive: false,
                                      freeVersion: true,
                                      freeDay: 0,
                                      dueDate: sale.dueDate,
                                      dueDateExtension: sale.dueDateExtension,
                                      mobileValue: pricingInstanceMobile.pricingValue
                                    };
                                    saleMobileAttributes.push(saleMobileAttribute);
                                  }
                                  return db.SaleMobile.bulkCreate(saleMobileAttributes, { transaction : t })
                                      .then((saleMobilesInstances: SaleMobileInstance[]) => sale);

                              }else {
                                  return db.Sale.create( saleInput, { transaction: t } )
                                    .then((saleInstance: SaleInstance) => saleInstance);
                              }
                            })

                      })
                })
            }
        })
    }),
    updateSale: compose(...authResolvers)((parent, { isActive, licenseCode }, { db, authCompany, requestedFields } : { db: DbConnection; authCompany: AuthCompany, requestedFields: RequestedFields }, info : GraphQLResolveInfo) => {
       if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
       return db.sequelize.transaction((t: Transaction) => {
         return db.Sale.find({ where : { companyId: authCompany.id, licenseCode: licenseCode }, attributes: requestedFields.getFields(info, { exclude: ['saleMobiles'], keep: ['id'] }) })
            .then((sale: SaleInstance) => {
                if(!sale) throw new GraphqlRequestRestError({ code: 422, messageError: "Plano não foi encontrado" });
               return sale.update({ isActive: isActive }, { transaction: t })
                  .then((saleUpdated: SaleInstance) => saleUpdated);
            })
       })
    })
  },

  Query : {
    findSales : compose(...authResolvers)((parent, { filter },{ db, authCompany, requestedFields } : { db: DbConnection; authCompany: AuthCompany, requestedFields: RequestedFields }, info : GraphQLResolveInfo) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
        let filterCondition = { where : { companyId: authCompany.id }, attributes: requestedFields.getFields(info, { exclude: ['saleMobiles'], keep: ['id'] }) };
        if(filter){
           if('isActive' in filter) filterCondition.where['isActive'] = filter.isActive;
           if('licenseCode' in filter) filterCondition.where['licenseCode'] = filter.licenseCode;
        }
          return db.Sale.findAll(filterCondition)
            .then((sales: SaleInstance[]) => sales)
    })
  }

}
