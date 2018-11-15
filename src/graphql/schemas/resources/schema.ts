import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";

import { Query } from "./query";
import { Mutation } from "./mutation";

import { companyTypes } from "../../resources/company/companySchema";
import { companyEmailTypes } from "../../resources/companyEmail/companyEmailSchema";
import { companyPhoneTypes } from "../../resources/companyPhone/companyPhoneSchema";
import { companyAddressTypes } from "../../resources/companyAddress/companyAddressSchema";
import { saleTypes } from "../../resources/sale/saleSchema";
import { saleMobileTypes } from "../../resources/salemobile/saleMobileSchema";

import { companyResolvers } from "../../resources/company/companyResolvers";
import { companyEmailResolvers } from "../../resources/companyEmail/companyEmailResolvers";
import { companyPhoneResolvers } from "../../resources/companyPhone/companyPhoneResolvers";
import { companyAddressResolvers } from "../../resources/companyAddress/companyAddressResolvers";
import { saleResolvers } from "../../resources/sale/saleResolvers";
import { saleMobilesResolvers } from "../../resources/salemobile/saleMobileResolver";

const resolvers = merge(
  companyResolvers,
  companyEmailResolvers,
  companyPhoneResolvers,
  companyAddressResolvers,
  saleResolvers,
  saleMobilesResolvers
);

const ShemaDefinitions = `
  type Schema {
    # Efetua as consultas na camada de persistência
    query: Query
    # Efetua as inserções e atualizações na camada de persistência
    mutation: Mutation
}
`;

export default makeExecutableSchema({
  typeDefs: [
    ShemaDefinitions,
    Query,
    Mutation,
    companyTypes,
    companyEmailTypes,
    companyPhoneTypes,
    companyAddressTypes,
    saleTypes,
    saleMobileTypes
  ],
  resolvers
});
