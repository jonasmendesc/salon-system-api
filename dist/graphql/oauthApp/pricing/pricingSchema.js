"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pricingTypes = `
  # Preco de venda
  type Pricing{
      # Identificador do registro
      id: ID!
      # Preco base venda
      pricingValue: Float!
      # Ativo
      isActive: Boolean!
      # Tio do preco
      pricingType: PricingType!
  }

 enum PricingType {
   PLAN,
   MOBILE
 }

 input Filter {
   isActive: Boolean!
   pricingType: PricingType
 }

`;
exports.pricingTypes = pricingTypes;
const pricingMutations = `
  # inserir registro de preço
  insertPricingSale(pricingValue: Float!, pricingType: PricingType!) : Pricing!
`;
exports.pricingMutations = pricingMutations;
const pricingQueries = `
  # Retona os valores basicos de preços
  findPricing(filter: Filter) : [Pricing!]!
`;
exports.pricingQueries = pricingQueries;
