"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companySchema_1 = require("../../resources/company/companySchema");
const companyEmailSchema_1 = require("../../resources/companyEmail/companyEmailSchema");
const companyPhoneSchema_1 = require("../../resources/companyPhone/companyPhoneSchema");
const companyAddressSchema_1 = require("../../resources/companyAddress/companyAddressSchema");
const saleSchema_1 = require("../../resources/sale//saleSchema");
const saleMobileSchema_1 = require("../../resources/salemobile/saleMobileSchema");
const Mutation = `
  type Mutation {
    ${companySchema_1.companiesMutations}
    ${companyEmailSchema_1.companyEmailMutations}
    ${companyPhoneSchema_1.companyPhoneMutations}
    ${companyAddressSchema_1.companAddressMutations}
    ${saleSchema_1.saleMutations}
    ${saleMobileSchema_1.saleMobileMutations}
  }
`;
exports.Mutation = Mutation;
