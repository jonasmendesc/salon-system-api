import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { GraphQLResolveInfo } from "graphql";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { CompanyPhoneInstance, CompanyPhoneAttributes } from "../../../models/companyPhoneModel";
import { Transaction } from "sequelize";

export const companyPhoneResolvers = {

    Mutation: {
        insertCompanyPhone: compose(...authResolvers)((parent, { phones }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let phonesFinds = phones.map(phone => phone.phone);
            return db.CompanyPhone.findAll({ where: { phone: { $in: phonesFinds }, companyId: authCompany.id } })
                .then((companyPhoneInstances: CompanyPhoneInstance[]) => {
                    if (companyPhoneInstances && companyPhoneInstances.length > 0) {
                        var phoneSenders: string = companyPhoneInstances.reduce((accum, curr) => {
                            if (accum)
                                return accum + ', ' + curr.phone;
                            return curr.phone;
                        }, "");
                        throw new GraphqlRequestRestError({ code: 500, messageError: `Telefone(s) já existem ${phoneSenders}` });

                    } else {

                        let companyPhones: CompanyPhoneAttributes[] = phones.map(phone => {
                            let companyPhone: CompanyPhoneAttributes = {
                                companyId: authCompany.id,
                                phone: phone.phone,
                                isActive: true,
                                phoneType: phone.phoneType
                            };
                            return companyPhone;
                        });
                        return db.sequelize.transaction((t: Transaction) => {
                            return db.CompanyPhone.bulkCreate(companyPhones, { transaction: t })
                                .then((companyPhones: CompanyPhoneInstance[]) => {
                                    return companyPhones;
                                }).catch((err: any) => {
                                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                                });
                        });
                    }
                }).catch((err: any) => {
                    throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                })
        }),
        updateCompanyPhone: compose(...authResolvers)((parent, { phone }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t: Transaction) => {
                return db.CompanyPhone.findOne({ where: { companyId: authCompany.id, id: phone.id } })
                    .then((companyPhone: CompanyPhoneInstance) => {
                        if (!companyPhone) throw new GraphqlRequestRestError({ code: 500, messageError: ` Telefone não foi encontrado ` });
                        return companyPhone.update({ phone: phone.phone, phoneType: phone.phoneType, isActive: phone.isActive }, { transaction: t })
                            .then((companyPhoneInstance: CompanyPhoneInstance) => {
                                return companyPhoneInstance;
                            }).catch((err: any) => {
                                throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                            });

                    }).catch((err: any) => {
                        throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
            })
        }),
        deleteCompanyPhone: compose(...authResolvers)((parent, { id }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.sequelize.transaction((t: Transaction) => {
                return db.CompanyPhone.findById(id)
                    .then((companyPhone: CompanyPhoneInstance) => {
                        if (!companyPhone) throw new GraphqlRequestRestError({ code: 500, messageError: ` Telefone não foi encontrado ` });
                        return companyPhone.destroy({ transaction: t })
                            .then(companyPhoneInstance => !!companyPhoneInstance)
                            .catch((err: any) => {
                                throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                            });
                    }).catch((err: any) => {
                        throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` });
                    });
            })
        })
    },

    Query: {
        findCompanyPhone: compose(...authResolvers)((parent, { filter }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            if (!filter) {
                return db.CompanyPhone.findAll({ where: { companyId: authCompany.id } })
                    .then((companyPhonesInstance: CompanyPhoneInstance[]) => {
                        return companyPhonesInstance
                    }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); })
            }
            let filterConditional = { where: { companyId: authCompany.id } }
            if ('isActive' in filter) filterConditional.where['isActive'] = filter.isActive;
            if ('phoneTypes' in filter) {
                filterConditional.where['phoneType'] = { $in: filter.phoneTypes }
            }
            return db.CompanyPhone.findAll(filterConditional)
                .then((companyPhonesInstance: CompanyPhoneInstance[]) => {
                    return companyPhonesInstance
                }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); })
        })
    }

}