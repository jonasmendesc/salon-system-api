const saleTypes = `
   # Venda
   type Sale {
       #Identificador do registro
       id: ID!
       # Quantidade em meses
       dateTimeMonthPlan : Int!
       # Codigo da licensa
       licenseCode: String!
       # Está ativo
       isActive: Boolean!
       # Define se é somente uma proposta
       proposed: Boolean!
       # Valor da venda
       salePrincing: Float!
       # Valor total
       saleTotal: Float!
       # Percentual de desconto
       discountPercentage: Int!
       # Valor do desconto
       discountValue: Float!
       # Venda gratis
       freeVersion: Boolean!
       # Dias gratis
       freeDay: Int!
       # Data de vencimento da venda
       dueDateExtension: String!
       # Data de vencimento
       dueDate: String!
       # Dispositivos
       saleMobiles: [ SaleMobile ]
   }

 # Dados de entrada para criar o plano
 input saleCreated {
    # Valor em mes
    dateTimeMonthPlan: Int!
    # Versão gratuita
    freeVersion: Boolean!
    # Valor em dias gratis
    freeDay: Int!
    # Define se é somente uma proposta
    proposed: Boolean!
    # Dispositivos de celulares
    saleMobiles: saleMobileCreated
 }

 input filterSale {
   isActive: Boolean
   licenseCode: String
 }

`;

const saleQueries = `
  # Busca os planos
  findSales(filter: filterSale): [ Sale ]
  # Executa o orçamento
  buildProposal(input: saleCreated) : Sale!
`;

const saleMutations = `
     # inserir um nova venda
     insertSale(input: saleCreated) : Sale!
     # Atualiza o plano
     updateSale(isActive: Boolean!, licenseCode: String!) : Sale!
`;

export { saleTypes, saleMutations, saleQueries }
