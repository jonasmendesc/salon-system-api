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
  # Cria um novo token a partir do email da empresa e o password da empresa
  createTokenCompany(email: String!, password: String!): Token
`;
exports.tokenMutations = tokenMutations;
