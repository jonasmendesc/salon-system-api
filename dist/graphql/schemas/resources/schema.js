"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const lodash_1 = require("lodash");
const query_1 = require("./query");
const mutation_1 = require("./mutation");
const companySchema_1 = require("../../resources/company/companySchema");
const companyEmailSchema_1 = require("../../resources/companyEmail/companyEmailSchema");
const companyPhoneSchema_1 = require("../../resources/companyPhone/companyPhoneSchema");
const companyAddressSchema_1 = require("../../resources/companyAddress/companyAddressSchema");
const saleSchema_1 = require("../../resources/sale/saleSchema");
const saleMobileSchema_1 = require("../../resources/salemobile/saleMobileSchema");
const companyResolvers_1 = require("../../resources/company/companyResolvers");
const companyEmailResolvers_1 = require("../../resources/companyEmail/companyEmailResolvers");
const companyPhoneResolvers_1 = require("../../resources/companyPhone/companyPhoneResolvers");
const companyAddressResolvers_1 = require("../../resources/companyAddress/companyAddressResolvers");
const saleResolvers_1 = require("../../resources/sale/saleResolvers");
const saleMobileResolver_1 = require("../../resources/salemobile/saleMobileResolver");
const resolvers = lodash_1.merge(companyResolvers_1.companyResolvers, companyEmailResolvers_1.companyEmailResolvers, companyPhoneResolvers_1.companyPhoneResolvers, companyAddressResolvers_1.companyAddressResolvers, saleResolvers_1.saleResolvers, saleMobileResolver_1.saleMobilesResolvers);
const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: [
        ShemaDefinitions,
        query_1.Query,
        mutation_1.Mutation,
        companySchema_1.companyTypes,
        companyEmailSchema_1.companyEmailTypes,
        companyPhoneSchema_1.companyPhoneTypes,
        companyAddressSchema_1.companyAddressTypes,
        saleSchema_1.saleTypes,
        saleMobileSchema_1.saleMobileTypes
    ],
    resolvers
});
