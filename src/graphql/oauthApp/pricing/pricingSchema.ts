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

const pricingMutations = `
  # inserir registro de preço
  insertPricingSale(pricingValue: Float!, pricingType: PricingType!) : Pricing!
`;

const pricingQueries = `
  # Retona os valores basicos de preços
  findPricing(filter: Filter) : [Pricing!]!
`;

export { pricingTypes, pricingMutations, pricingQueries }
