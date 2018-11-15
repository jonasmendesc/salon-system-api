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

const mutationsAuhorization = `
    createAuthorization(name: String!) : Authorization! 
`;

export { authorizationsTypes,  mutationsAuhorization }