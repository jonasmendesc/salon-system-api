"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizationsTypes = `
    # Autorização para consumir os rercusos da api    
    type Authorization {
        # Chave sercreta do cliente
        clientId : String!
        # Chave secreta
        clientSecret: String!
        # Nome da aplicacao
        name: String!
    }
`;
exports.authorizationsTypes = authorizationsTypes;
const mutationsAuhorization = `
    createAuthorization(name: String!) : Authorization! 
`;
exports.mutationsAuhorization = mutationsAuhorization;
