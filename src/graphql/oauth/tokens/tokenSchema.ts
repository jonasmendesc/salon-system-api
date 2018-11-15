const tokenTypes = `
    # Definição para o token
   type Token {
     # Campo com o valor do token
     token: String!
     # Tempo de expiração do token em segundos
     expiresIn: Int!
   }
`;

const tokenMutations = `
  # Cria um novo token baseado no clientId
  createToken : Token
`;

const tokenQueries = `
   dummy : Boolean!
`;

export { tokenTypes, tokenMutations, tokenQueries }
