"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenTypes = `
    # Definição para o token
   type Token {
     # Campo com o valor do token
     token: String!
     # Tempo de expiração do token em segundos
     expiresIn: Int!
   }
`;
exports.tokenTypes = tokenTypes;
const tokenMutations = `
  # Cria um novo token baseado no clientId
  createToken : Token
`;
exports.tokenMutations = tokenMutations;
const tokenQueries = `
   dummy : Boolean!
`;
exports.tokenQueries = tokenQueries;
