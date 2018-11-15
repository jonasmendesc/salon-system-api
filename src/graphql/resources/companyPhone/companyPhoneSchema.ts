const companyPhoneTypes = `
    # Telefone da empresa
    type CompanyPhone {
        # Identificador do telefone
        id: ID!
        # Numero do telefone
        phone: String!
        # Tipo do telefone
        phoneType: String!
        # Se está ativo
        isActive: Boolean!
        # Data de criação do registo
		createdAt: String!
    }

    # Entrada para os telefones da empresa
    input CreateCompanyPhones {
        # Telefone
        phone: String!
        # Tipo do telefone
        phoneType: CompanyPhoneType!
    }

    enum CompanyPhoneType {
        Comercial
        Residencial
        Outro
    }

    # Dados para o busca do telefone
    input FindCompanyPhone {
        # Tipo do telefone
        phoneTypes: [ CompanyPhoneType! ]
        # Ativo ou Desativado
        isActive: Boolean
    }

    # Dados para atualizar o telefone
    input CompanyPhoneUpdate {
        # Identificador do telefone
        id: ID!
        # Numero do telefone
        phone: String!
        # Tipo do telefone
        phoneType: CompanyPhoneType!
        # Se está ativo
        isActive: Boolean!
    }

`;

const companyPhoneMutations = `
    # insere um novo telefone
    insertCompanyPhone(phones: [CreateCompanyPhones!]!) :[CompanyPhone!]!
    # atualizar os telefone
    updateCompanyPhone(phone: CompanyPhoneUpdate!) : CompanyPhone
    # deletar o telefone
    deleteCompanyPhone(id: ID!): Boolean
`;

const compaanyPhoneQueries = `
    # retorna os telefones da empresa
    findCompanyPhone(filter: FindCompanyPhone): [CompanyPhone!]!
`

export { companyPhoneTypes, companyPhoneMutations, compaanyPhoneQueries }