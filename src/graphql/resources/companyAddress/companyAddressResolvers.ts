import { compose } from "../../composable/composableResolvers";
import { authResolvers } from "../../composable/authResolvers";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AuthCompany } from "../../../interfaces/AuthCompanyInterface";
import { RequestedFields } from "../../ast/requestedFields";
import { GraphQLResolveInfo } from "graphql";
import { GraphqlRequestRestError } from "../../../utils/customerErrors/graphqlRequestRestError";
import { CompanyAddressInstance, CompanyAddressAtrribute } from "../../../models/companyAddressModel";
import { Transaction } from "sequelize";

export const companyAddressResolvers = {

    Query: {
        findCompanyAddress: compose(...authResolvers)((parent, { isActive }, { db, authCompany, requestedFields }: { db: DbConnection; authCompany: AuthCompany, requestedFields: RequestedFields }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let filterConditional = { where: { companyId: authCompany.id }, attributes: requestedFields.getFields(info) }
            if (isActive != undefined) {
                filterConditional.where['isActive'] = isActive;
            }
            return db.CompanyAddress.findAll(filterConditional)
                .then((companyAddresses: CompanyAddressInstance[]) => companyAddresses)
                .catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })

        })
    },
    Mutation: {
        insertAddressCompany: compose(...authResolvers)((parent, { addresses }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let addressesFind = addresses.map(address => address.addressPurpose);
            return db.CompanyAddress.findAll({ where: { companyId: authCompany.id, addressPurpose: { $in: addressesFind } } })
                .then((companyAddressInstance: CompanyAddressInstance[]) => {
                    if (companyAddressInstance && companyAddressInstance.length > 0) {
                        var addresSenders: string = companyAddressInstance.reduce((accum, curr) => {
                            if (accum)
                                return accum + ', ' + curr.addressPurpose;
                            return curr.addressPurpose;
                        }, "");
                        throw new GraphqlRequestRestError({ code: 500, messageError: `Propositos para endereços já existe(m) ${addresSenders}` });
                    } else {
                        return db.sequelize.transaction((t: Transaction) => {

                            let companyAddressInsert: CompanyAddressAtrribute[] = addresses.map(companyAddress => {
                                let companyAddressAttribute: CompanyAddressAtrribute = {
                                    address: companyAddress.address,
                                    addressType: companyAddress.addressType,
                                    cep: companyAddress.cep,
                                    city: companyAddress.city,
                                    companyId: authCompany.id,
                                    neighbordhood: companyAddress.neighbordhood,
                                    addressNumber: companyAddress.addressNumber,
                                    addressPurpose: companyAddress.addressPurpose
                                }
                                return companyAddressAttribute;
                            });

                            return db.CompanyAddress.bulkCreate(companyAddressInsert, { transaction: t })
                                .then((companyAddressInstances: CompanyAddressInstance[]) => companyAddressInstances)
                                .catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })
                        })
                    }
                })
        }),
        updateAddressCompany: compose(...authResolvers)((parent, { address }, { db, authCompany }: { db: DbConnection; authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyAddress.findOne({ where: { companyId: authCompany.id, id: address.id } })
                .then((companyAddress: CompanyAddressInstance) => {
                    if (!companyAddress) throw new GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado o endereço para ser atualizado` })
                    return db.CompanyAddress.find({ where: { companyId: authCompany.id, addressPurpose: address.addressPurpose } })
                        .then((companyAddressInstance: CompanyAddressInstance) => {
                            if (companyAddressInstance && companyAddressInstance.id != address.id) throw new GraphqlRequestRestError({ code: 500, messageError: `Já existe um outro endereco desse tipo` });
                            return db.sequelize.transaction((t: Transaction) => {
                                return companyAddress.update(address, { transaction: t })
                                    .then((companyAddressInstance: CompanyAddressInstance) => companyAddressInstance)
                                    .catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })
                            })
                        })

                }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })
        }),
        deleteAddressCompany: compose(...authResolvers)((parent, { id }, { db, authCompany }: { db: DbConnection, authCompany: AuthCompany }, info: GraphQLResolveInfo) => {
            if (!authCompany) throw new GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyAddress.findOne({ where: { companyId: authCompany.id } })
                .then((companyAddressInstance: CompanyAddressInstance) => {
                    if (!companyAddressInstance) throw new GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado o endereço para ser atualizado` });
                     return db.sequelize.transaction((t: Transaction) => {
                         return companyAddressInstance.destroy({ transaction: t })
                            .then((companyAddress) =>  !!companyAddress)
                            .catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })
                     })    
                }).catch((err: any) => { throw new GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }) })
        })
    }

}