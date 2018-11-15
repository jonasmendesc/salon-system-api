"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composableResolvers_1 = require("../../composable/composableResolvers");
const authResolvers_1 = require("../../composable/authResolvers");
const graphqlRequestRestError_1 = require("../../../utils/customerErrors/graphqlRequestRestError");
exports.companyAddressResolvers = {
    Query: {
        findCompanyAddress: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { isActive }, { db, authCompany, requestedFields }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let filterConditional = { where: { companyId: authCompany.id }, attributes: requestedFields.getFields(info) };
            if (isActive != undefined) {
                filterConditional.where['isActive'] = isActive;
            }
            return db.CompanyAddress.findAll(filterConditional)
                .then((companyAddresses) => companyAddresses)
                .catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        })
    },
    Mutation: {
        insertAddressCompany: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { addresses }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            let addressesFind = addresses.map(address => address.addressPurpose);
            return db.CompanyAddress.findAll({ where: { companyId: authCompany.id, addressPurpose: { $in: addressesFind } } })
                .then((companyAddressInstance) => {
                if (companyAddressInstance && companyAddressInstance.length > 0) {
                    var addresSenders = companyAddressInstance.reduce((accum, curr) => {
                        if (accum)
                            return accum + ', ' + curr.addressPurpose;
                        return curr.addressPurpose;
                    }, "");
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Propositos para endereços já existe(m) ${addresSenders}` });
                }
                else {
                    return db.sequelize.transaction((t) => {
                        let companyAddressInsert = addresses.map(companyAddress => {
                            let companyAddressAttribute = {
                                address: companyAddress.address,
                                addressType: companyAddress.addressType,
                                cep: companyAddress.cep,
                                city: companyAddress.city,
                                companyId: authCompany.id,
                                neighbordhood: companyAddress.neighbordhood,
                                addressNumber: companyAddress.addressNumber,
                                addressPurpose: companyAddress.addressPurpose
                            };
                            return companyAddressAttribute;
                        });
                        return db.CompanyAddress.bulkCreate(companyAddressInsert, { transaction: t })
                            .then((companyAddressInstances) => companyAddressInstances)
                            .catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
                    });
                }
            });
        }),
        updateAddressCompany: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { address }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyAddress.findOne({ where: { companyId: authCompany.id, id: address.id } })
                .then((companyAddress) => {
                if (!companyAddress)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado o endereço para ser atualizado` });
                return db.CompanyAddress.find({ where: { companyId: authCompany.id, addressPurpose: address.addressPurpose } })
                    .then((companyAddressInstance) => {
                    if (companyAddressInstance && companyAddressInstance.id != address.id)
                        throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Já existe um outro endereco desse tipo` });
                    return db.sequelize.transaction((t) => {
                        return companyAddress.update(address, { transaction: t })
                            .then((companyAddressInstance) => companyAddressInstance)
                            .catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
                    });
                });
            }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        }),
        deleteAddressCompany: composableResolvers_1.compose(...authResolvers_1.authResolvers)((parent, { id }, { db, authCompany }, info) => {
            if (!authCompany)
                throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Token invalido ou empresa não foi encontrada` });
            return db.CompanyAddress.findOne({ where: { companyId: authCompany.id } })
                .then((companyAddressInstance) => {
                if (!companyAddressInstance)
                    throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `Não foi encontrado o endereço para ser atualizado` });
                return db.sequelize.transaction((t) => {
                    return companyAddressInstance.destroy({ transaction: t })
                        .then((companyAddress) => !!companyAddress)
                        .catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
                });
            }).catch((err) => { throw new graphqlRequestRestError_1.GraphqlRequestRestError({ code: 500, messageError: `${err.name}: ${err.message}` }); });
        })
    }
};
