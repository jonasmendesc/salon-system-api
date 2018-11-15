const saleMobileTypes = `
    # Venda de celular
    type SaleMobile {
        # Identificador do registro
        id: ID!
        # Quantidade em mes que o telefone ficará habilitado
        dateTimeMonthPlan: Int!
        # Código de licensa do celular
        licenseCode: String!
        # Numero do serial do dispositivo
        serialNumber: String
        # Nome do dispositivo
        nameMobile: String
        # Está ativo
        isActive: Boolean!
        # Versão gratis
        freeVersion: Boolean!
        # Dias gratis de uso do dispositivo
        freeDay: Int!
        # Data de vencimento em pt
        dueDateExtension: String!
        # Data de vencimento
        dueDate: String!
        # Valor da venda
        mobileValue: Float!
    }

     # inserir os dados para uma nova venda de celular
     input saleMobileCreated {
      # Quantidade em mes que o telefone ficara habilitado
      amount: Int!
    }

    # inserir novos dispsitivos
    input saleMobileAdditionalInput {
      # Valor em mes para adição
      dateTimeMonthPlan: Int!
    }
`;

const saleMobileMutations = `
  # adiciona novos dispositivos para os planos
  addPlanAdditional(dateTimeMonthPlan: Int!, amountMobile: Int!) : Sale!
  # atualiza os registros de celular
  updateSaleMobile(licenseCode: String!, isActive: Boolean!, serialNumber: String, nameMobile: String) : SaleMobile!

`;

export { saleMobileTypes, saleMobileMutations }
