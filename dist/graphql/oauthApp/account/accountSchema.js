"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companyCreatedTypes = `
   # Empresa criada
   type CompanyCreated {
    # Identificador da empresa
    id: ID!
    # Nome da empresa
    name: String!
    # Código de validação de email
    validateEmailCode: String!
    # Código da licensa que foi criado
    licenseCode: String!
    # Empresa está ativa
    isActive: Boolean!
    # Data de criacao do registro
    createdAt: String!
    # Emails da empresa
    companyEmails: [CompanyEmail!]!
 }

 # Email da empresa
 type CompanyEmail {
    #Identificador do registro
    id: ID!
    # Email
    email: String!
    # Se é email principal
    isMain: Boolean!
    # Verifica se está ativo
    isActive : Boolean!
    # Email foi validado
    isValidade: Boolean!
    # Data de criação do registo
    createdAt: String!

 }

 # Telefone da empresa
 type CompanyPhone {
    # Identificador do telefone
    id: ID!
    # Telefone
    phone: String!
    # Tipo de telefone
    phoneType: String!
    # Está ativo
    isActive: Boolean!
    # Data de criacao do registro
    createdAt: String!
 }

 # Endereco da empresa
 type CompanyAddress {
     # Identificador do endereco
     id: ID!
     # Endereço
     address: String!
     # Numero do endereço
     addressNumber: String!
     # Proposito do endereço
     addressPurpose: String!
     # Codigo da caixa postal
     cep: String,
     # Tipo do endereço
     addressType: String!
     # Bairro
     neighbordhood: String!
     # Cidade
     city: String!
     # Estado
     state: String!
     # País
     country: String!
     # Esta ativo
     isActive: Boolean!
     # Data de criacao do registro
     createdAt: String!
 }

 # Dados da empresa
input companyCreate{
    # Nome da empresa
    name: String!
    # Senha da empresa
    password: String!
}

# Dados do email da empresa
input companyEmailCreate {
    # email da empresa
    email: String!
    # marca se é o email principal
    isMain: Boolean!
}

# Dados do endereço
input companyAddress{
    # logradouro
    address: String!
    # Numero do endereço
    addressNumber: String!
    # Proposito do endereço
    addressPurpose: AddressPurpose!
    # Tipo de logradouro
    addressType: String!
    # Cidade
    city: String!
    # Estado
    state: String!
    # Bairro
    neighborhood: String!
    # Endereço da caixa postal
    cep: String
}

# Dados do Telefone
input phone {
    # Numero do telefone
    phoneNumber: String!
    # Tipo de tefone
    phoneType: String!
}

enum AddressPurpose{
    Comercial
    Entrega
    Cobranca
 }

`;
exports.companyCreatedTypes = companyCreatedTypes;
const companyMutations = `
    # Cria a empresa
    createCompany(input: companyCreate!, emails: [companyEmailCreate!]!): CompanyCreated!
`;
exports.companyMutations = companyMutations;
const companyQueries = `
    # Retorna true
    dummy : Boolean!
`;
exports.companyQueries = companyQueries;
