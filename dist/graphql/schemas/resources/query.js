"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companySchema_1 = require("../../resources/company/companySchema");
const companyEmailSchema_1 = require("../../resources/companyEmail/companyEmailSchema");
const companyPhoneSchema_1 = require("../../resources/companyPhone/companyPhoneSchema");
const companyAddressSchema_1 = require("../../resources/companyAddress/companyAddressSchema");
const saleSchema_1 = require("../../resources/sale/saleSchema");
const Query = `
  type Query {
      ${companySchema_1.companiesQueries}
      ${companyEmailSchema_1.companyEmailQueries}
      ${companyPhoneSchema_1.compaanyPhoneQueries}
      ${companyAddressSchema_1.companyAddressQueries}
      ${saleSchema_1.saleQueries}
  }
`;
exports.Query = Query;
