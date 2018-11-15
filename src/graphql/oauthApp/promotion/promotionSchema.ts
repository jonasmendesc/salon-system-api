const promotionTypes = `
    # Configuração para os preços
    type Promotion {
      # Identificador do registro
      id: ID!
      # Valor inicial do mes
      dateTimeMonthInitial: Int!
      # Valor final do mes
      dateTimeMonthEnd: Int!
      # Percentual do desconto
      discountPercentage: Float!
      # Está ativo
      isActive: Boolean!
    }

    input PromotionCreate {
      # Valor inicial do mes
      dateTimeMonthInitial: Int!
      # Valor final do mes
      dateTimeMonthEnd: Int!
      # Percentual do desconto
      discountPercentage: Float!
    }

`;

const promotionMutations = `
  # inserir uma nova promoção
  insertPromotion(input: PromotionCreate!): Promotion!
  # Deletar os registros do promoção
  deletePromotion(id: ID!): Boolean!
`;

const promotitonQueries = `
  # retorna as promoçoes para os planos
  findPromotion(isActive: Boolean!): [Promotion!]
`;

export { promotionTypes, promotionMutations, promotitonQueries}
