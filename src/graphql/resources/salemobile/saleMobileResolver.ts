import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { SaleInstance, SaleAttribute } from "../../../models/saleModel";
import { PricingInstance } from "../../../models/pricingModel";
import { PromotionInstance } from "../../../models/promotionModel";
import { SaleMobileAttributes, SaleMobileInstance } from "../../../models/saleMobileModel";
import { truncade } from "../../../utils/util";
import { RequestedFields } from "../../ast/requestedFields";

export const saleMobilesResolvers = {
  Sale: {
    saleMobiles: (sale, args, { db,requestedFields }: { db: DbConnection, requestedFields: RequestedFields }, info) => {
      return db.SaleMobile.findAll( { where: { saleId : sale.get('id') }, attributes: requestedFields.getFields(info) } )
        .then((saleMobiles: SaleMobileInstance[]) => saleMobiles);
    }
  },
  Mutation:{
    addPlanAdditional: compose(...authResolvers)((parent, { dateTimeMonthPlan, amountMobile }, { db, authCompany } : { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
       return db.sequelize.transaction((t: Transaction) => {
           return db.Sale.findAll( { where: { isActive: true, companyId: authCompany.id } } )
          .then((sale: SaleInstance[]) => {
               if(!sale) throw new GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado um registro de venda válido` });
               return db.Pricing.find({ where: { isActive: true, pricingType: 'MOBILE' } })
                 .then((pricing: PricingInstance) => {
                    if(!pricing) throw new GraphqlRequestRestError({ code: 500, messageError: `Preço de venda para celualr não foi encontrado` });
                    return db.Promotion.find({ where: { isActive: true, dateTimeMonthInitial: { $lte: dateTimeMonthPlan }, dateTimeMonthEnd: { $gte: dateTimeMonthPlan } } })
                      .then((promotion: PromotionInstance) => {
                          var dateCurrent = new Date();
                          if(!promotion) throw new GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado politica de desconto` });                          
                        
                           let saleInput : SaleAttribute = {}; 
                           saleInput.saleTotal = truncade(amountMobile * Number(pricing.pricingValue));
                           saleInput.companyId = authCompany.id;
                           saleInput.dateTimeMonthPlan = dateTimeMonthPlan;
                           saleInput.discountPercentage = promotion.discountPercentage;
                           saleInput.isActive = false;
                           saleInput.proposed = false;
                           saleInput.discountValue = saleInput.discountPercentage > 0 ? 
                             truncade(promotion.discountPercentage / 100 * saleInput.saleTotal) : 0.00;
                          saleInput.salePrincing = truncade(saleInput.saleTotal - saleInput.discountValue);
                          saleInput.freeVersion = false;
                          saleInput.freeDay = 0;
                          saleInput.dueDate = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + dateTimeMonthPlan)).toDateString();
                          saleInput.dueDateExtension = new Date(dateCurrent.setMonth(dateCurrent.getMonth() + dateTimeMonthPlan)).toLocaleDateString("pt-BR", {
                            weekday: "long", year: "numeric", month: "short",
                            day: "numeric"
                          });

                          return db.Sale.create(saleInput, { transaction : t })
                            .then((sale : SaleInstance) => {
                                let saleMobileAttributes: SaleMobileAttributes[] = new Array<SaleMobileAttributes>();
                                for (let i = 0; i < amountMobile; i++) {
                                    let saleMobileAttribute : SaleMobileAttributes = {
                                      companyId : authCompany.id,
                                      saleId: sale.id,
                                      dateTimeMonthPlan: sale.dateTimeMonthPlan,
                                      isActive: false,
                                      freeVersion: true,
                                      freeDay: 0,
                                      dueDate: sale.dueDate,
                                      dueDateExtension: sale.dueDateExtension,
                                      mobileValue: pricing.pricingValue
                                    };
                                    saleMobileAttributes.push(saleMobileAttribute);
                                  }
                              return db.SaleMobile.bulkCreate(saleMobileAttributes, { transaction : t })
                                  .then((saleMobile: SaleMobileInstance[]) => sale)

                            })
                          
                      })
                    
                 })
               
          })

       })  
    }),
    updateSaleMobile: compose(...authResolvers)((parent, { licenseCode, isActive, serialNumber, nameMobile }, { db, authCompany } : { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
        if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
        return db.sequelize.transaction((t: Transaction) => {
          return db.SaleMobile.find({ where: { companyId: authCompany.id, licenseCode: licenseCode } })
            .then((saleMobile: SaleMobileInstance) => {
              if(!saleMobile) throw new GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado um dipositivo valido` });
                let saleMobileUpdate : SaleMobileAttributes = { isActive: isActive };
                if(serialNumber) saleMobileUpdate.serialNumber = serialNumber;
                if(nameMobile) saleMobileUpdate.nameMobile = nameMobile;
                return saleMobile.update(saleMobileUpdate, { transaction: t })
                  .then((saleMobile: SaleMobileInstance) => {
                    return saleMobile;
                  })
            })
        })
    })
  }
}
